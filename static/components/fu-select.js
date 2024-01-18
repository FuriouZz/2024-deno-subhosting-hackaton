import { html, LitElement } from "lit";

globalThis.customElements.define(
  "fu-select",
  class Select extends LitElement {
    static properties = {
      name: {},
      value: {},
      defaultValue: {},
      size: {},
      placeholder: {},
      multiple: {},
      maxOptionsVisible: {},
      disabled: {},
      clearable: {},
      open: {},
      hoist: {},
      filled: {},
      pill: {},
      label: {},
      placement: {},
      helpText: {},
      form: {},
      required: {},
      getTag: {},
      validity: {},
      validationMessage: {},
      updateComplete: {},
    };

    // Transfer slots
    onSlotChange(e) {
      const nodes = e.currentTarget.assignedNodes({ flatten: true });
      const select = this.renderRoot.querySelector("sl-select");
      select?.append(...nodes);
    }

    render() {
      return html`<sl-select
        value="${this.value}"
        placeholder="${this.placeholder}"
      >
        <slot @slotchange=${this.onSlotChange}></slot>
      </sl-select>`;
    }
  },
);
