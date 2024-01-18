import { html, LitElement } from "lit";
import { createProject } from "@/src/lib/api.js";

globalThis.customElements.define(
  "fu-create-project-form",
  class extends LitElement {
    onSubmit = async (e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const response = await createProject(data.get("name"));
      this.errorElement.style.display = "none";
      if (response.status >= 400) {
        const { message } = await response.json();
        this.errorElement.textContent = message;
        this.errorElement.style.display = "block";
      } else {
        this.formElement.reset();
      }
    };

    onSlotChange(e) {
      const nodes = e.currentTarget.assignedNodes({ flatten: true });
      const form = nodes.find((node) => node instanceof HTMLFormElement);
      form.addEventListener("submit", this.onSubmit);
      this.formElement = form;
      this.errorElement = form.querySelector(".error-message");
    }

    render() {
      return html`
        <slot @slotchange=${this.onSlotChange}></slot>
      `;
    }
  },
);
