import { createRef, ref } from "lit/directives/ref.js";
import { html, LitElement } from "lit";

globalThis.customElements.define(
  "fu-create-page-form",
  class extends LitElement {
    alertElement = createRef();
    drawerElement = createRef();

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
        this.drawerElement.value?.hide();
        this.alertElement.value?.toast({
          type: "success",
          title: "Page created",
        });
      }
    };

    openDrawer = () => {
      console.log("open", this.drawerElement);
      this.drawerElement.value?.show();
    };

    closeDrawer = () => {
      this.drawerElement.value?.hide();
    };

    onSlotForm = (e) => {
      if (this.formElement) {
        this.formElement?.removeEventListener("submit", this.onSubmit);
      }

      const form = e.currentTarget.assignedNodes({ flatten: true })[0];
      this.formElement = form;
      this.formElement?.addEventListener("submit", this.onSubmit);
    };

    render() {
      return html`
        <sl-drawer label="Create a page" ${ref(this.drawerElement)}>
          <slot name="form" @slotchange=${this.onSlotForm}></slot>
          <sl-button slot="footer" variant="primary" @click=${this.closeDrawer}>Close</sl-button>
        </sl-drawer>

        <slot name="actions"></slot>
        <sl-button variant="primary" @click=${this.openDrawer}>Create page</sl-button>

        <fu-alert ${ref(this.alertElement)}></fu-alert>
      `;
    }
  },
);
