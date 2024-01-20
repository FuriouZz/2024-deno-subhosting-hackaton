import { createRef, ref } from "lit/directives/ref.js";
import { html, LitElement } from "lit";

globalThis.customElements.define(
  "fu-select",
  class Select extends LitElement {
    static properties = {
      value: {},
      placeholder: {},
    };

    selectElement = createRef();

    // Transfer slots
    onSlotChange(e) {
      const nodes = e.currentTarget.assignedNodes({ flatten: true });
      this.selectElement.value?.append(...nodes);
    }

    render() {
      return html`<sl-select
        ${ref(this.selectElement)}
        value="${this.value}"
        placeholder="${this.placeholder}"
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </sl-select>`;
    }
  },
);
