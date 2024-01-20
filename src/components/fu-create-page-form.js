import { createRef, ref } from "lit/directives/ref.js";
import { html, LitElement } from "lit";

globalThis.customElements.define(
  "fu-create-page-form",
  class extends LitElement {
    alertElement = createRef();

    onSubmit = async (e) => {
      e.preventDefault();

      /** @type {HTMLFormElement} */
      const form = e.currentTarget;
      const data = new FormData(form);

      const response = await fetch(form.action, {
        method: "POST",
        body: data,
      });

      if (response.status >= 400) {
        const { message } = await response.json();

        this.alertElement.value?.toast({
          type: "error",
          title: "An error occured",
          description: message,
        });
      } else {
        form.reset();
        this.drawerElement?.hide();
        this.alertElement.value?.toast({
          type: "success",
          title: "Page created",
        });
      }
    };

    openDrawer = () => {
      this.drawerElement?.show();
    };

    onSlotButton = (e) => {
      if (this.buttonElement) {
        this.buttonElement.removeEventListener("click", this.openDrawer);
      }

      const button = e.currentTarget.assignedNodes({ flatten: true })[0];
      this.buttonElement = button;
      this.buttonElement.addEventListener("click", this.openDrawer);
    };

    onSlotDrawer = (e) => {
      const drawer = e.currentTarget.assignedNodes({ flatten: true })[0];
      this.drawerElement = drawer;
      const form = drawer.querySelector("form");
      form?.addEventListener("submit", this.onSubmit);
    };

    render() {
      return html`
        <slot name="drawer" @slotchange=${this.onSlotDrawer}></slot>
        <slot name="button" @slotchange=${this.onSlotButton}></slot>

        <fu-alert ${ref(this.alertElement)}></fu-alert>
      `;
    }
  },
);
