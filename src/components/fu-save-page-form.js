import { html, LitElement } from "lit";

globalThis.customElements.define(
  "fu-save-page-form",
  class extends LitElement {
    onSubmit = async (e) => {
      e.preventDefault();

      /** @type {HTMLFormElement} */
      const form = e.currentTarget;
      const data = new FormData(form);

      const response = await fetch(form.action, {
        method: "put",
        body: data,
      });

      this.errorElement.style.display = "none";
      if (response.status >= 400) {
        const { message } = await response.json();
        this.errorElement.textContent = message;
        this.errorElement.style.display = "block";
      }
    };

    onSlotChange(e) {
      const nodes = e.currentTarget.assignedNodes({ flatten: true });
      const form = nodes.find((node) => node instanceof HTMLFormElement);
      form.addEventListener("submit", this.onSubmit);
      this.errorElement = form.querySelector(".error-message");
    }

    render() {
      return html`
        <slot @slotchange=${this.onSlotChange}></slot>
      `;
    }
  },
);
