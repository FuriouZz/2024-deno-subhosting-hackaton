import { createRef, ref } from "lit/directives/ref.js";
import { html, LitElement } from "lit";
import { escapeHtml } from "@/islands/lib/utils.js";

globalThis.customElements.define(
  "fu-alert",
  class extends LitElement {
    dangerAlert = createRef();
    successAlert = createRef();

    /**
     * @param {{
     *   type: "success" | "error";
     *   title: string;
     *   description?: string;
     * }} data
     */
    toast(data) {
      const element = data.type === "success"
        ? this.successAlert
        : data.type === "error"
        ? this.dangerAlert
        : undefined;
      if (!element) return;

      const title = element.value?.querySelector(".title");
      const desc = element.value?.querySelector(".description");
      if (title) title.textContent = escapeHtml(data.title);
      if (desc && data.desc) desc.textContent = escapeHtml(data.desc);
      element.value?.toast();
    }

    render() {
      return html`
      <sl-alert variant="success" duration="3000" closable ${
        ref(this.successAlert)
      }>
        <sl-icon slot="icon" name="check2-circle"></sl-icon>
        <strong class="title"></strong><br />
        <span class="description"></span>
      </sl-alert>

      <sl-alert variant="danger" closable ${ref(this.dangerAlert)}>
        <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
        <strong class="title"></strong><br />
        <span class="description"></span>
      </sl-alert>
    `;
    }
  },
);
