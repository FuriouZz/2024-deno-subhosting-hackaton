import { html, LitElement } from "lit";
import { createProject } from "../lib/api.js";

globalThis.customElements.define(
  "fu-create-project-form",
  class CreateProjectForm extends LitElement {
    onSubmit(e) {
      e.preventDefault();
      const data = new FormData(e.currentTarget);
      createProject(data.get("name"));
    }

    onSlotChange(e) {
      const nodes = e.currentTarget.assignedNodes({ flatten: true });
      const form = nodes.find((node) => node instanceof HTMLFormElement);
      form.addEventListener("submit", this.onSubmit);
    }

    render() {
      return html`<slot @slotchange=${this.onSlotChange}></slot>`;
    }
  },
);
