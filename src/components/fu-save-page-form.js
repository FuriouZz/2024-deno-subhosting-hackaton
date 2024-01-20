import { html, LitElement } from "lit";
import { milliseconds } from "@/src/lib/utils.js";
import { createRef, ref } from "lit/directives/ref.js";

globalThis.customElements.define(
  "fu-save-page-form",
  class extends LitElement {
    static properties = {
      delay: { type: Number },
      pageId: { attribute: "page-id" },
      projectId: { attribute: "project-id" },
      _changed: { type: Boolean },
    };

    constructor() {
      super();
      this.delay = 3000;
    }

    alertElement = createRef();

    onSubmit = (e) => {
      e.preventDefault();
      this.publish();
    };

    async publish() {
      const form = this.formElement;
      if (!form) return;

      const tab = form.querySelector(".saving-tab");
      if (tab) tab.style.display = "block";

      const body = new FormData(form);
      try {
        const response = await fetch(form.action, { method: "put", body });

        if (response.status >= 400) {
          const { message } = await response.json();

          this.alertElement.value?.toast({
            type: "error",
            title: "An error occured",
            description: message,
          });
        } else {
          this.alertElement.value?.toast({
            type: "success",
            title: "Changes saved",
          });
        }
      } finally {
        await milliseconds(1000);
        if (tab) tab.style.display = "";
      }
    }

    /**
     * Fetch form and its inputs
     */
    onSlotChange(e) {
      this.removeListeners?.();

      const nodes = e.currentTarget.assignedNodes({ flatten: true });

      /** @type {HTMLFormElement} */
      const form = nodes.find((node) => node instanceof HTMLFormElement);
      form.addEventListener("submit", this.onSubmit);
      this.formElement = form;

      const deleteBtn = form.querySelector("sl-button[variant=danger]");
      deleteBtn?.addEventListener("click", this.onDeletePage);

      let id = -1;
      const elements = form.querySelectorAll("sl-input, sl-select, fu-editor");

      elements.forEach((element) => {
        const triggerChange = () => {
          clearTimeout(id);
          id = setTimeout(() => this.publish(), this.delay);
        };
        element.addEventListener("sl-input", triggerChange);
      });

      this.removeListeners = () => {
        form.removeEventListener("submit", this.onSubmit);
        deleteBtn?.removeEventListener("click", this.onDeletePage);
        elements.forEach((element) => {
          element.removeEventListener("sl-input", triggerChange);
        });
      };
    }

    onDeletePage = async () => {
      const response = await fetch(
        `/api/projects/${this.projectId}/pages/${this.pageId}`,
        {
          method: "DELETE",
        },
      );

      if (response.status >= 400) {
        const { message } = await response.json();

        this.alertElement.value?.toast({
          type: "error",
          title: "An error occured",
          description: message,
        });
      } else {
        this.alertElement.value?.toast({
          type: "success",
          title: "Page deleted",
        });

        window.location.href = `/projects/${this.projectId}`;
      }
    };

    render() {
      return html`
        <slot @slotchange=${this.onSlotChange}></slot>

        <fu-alert ${ref(this.alertElement)}></fu-alert>
      `;
    }
  },
);
