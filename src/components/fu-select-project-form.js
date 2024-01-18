import { html, LitElement } from "lit";

globalThis.customElements.define(
  "fu-select-project-form",
  class extends LitElement {
    onSubmit = (e) => {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      const project = data.get("project");
      window.location.href = `/projects/${project}`;
    };

    onSlotChange(e) {
      const nodes = e.currentTarget.assignedNodes({ flatten: true });
      const form = nodes.find((node) => node instanceof HTMLFormElement);
      form.addEventListener("submit", this.onSubmit);
    }

    render() {
      return html`
        <slot @slotchange=${this.onSlotChange}></slot>
      `;
    }
  },
);
