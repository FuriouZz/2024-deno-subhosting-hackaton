import { createRef, ref } from "lit/directives/ref.js";
import { css, html, nothing } from "lit";
import { LitElement } from "lit";
import { DeployementsSignal } from "@/islands/lib/store.js";
import { repeat } from "lit/directives/repeat.js";
import { createEffect } from "@furiouzz/reactive";

const styles = css`
iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

sl-drawer {
  --size: 100%;
  --body-spacing: 0;
}
`;

globalThis.customElements.define(
  "fu-page-actions",
  class extends LitElement {
    static styles = styles;

    static properties = {
      projectId: { attribute: "project-id" },
      _drawerVisible: { type: Boolean },
      _previewURL: { type: String },
      _deployments: {},
    };

    drawerElement = createRef();
    alertElement = createRef();

    constructor() {
      super();
      this._drawerVisible = false;
    }

    firstUpdated() {
      createEffect(() => this._deployments = DeployementsSignal());
    }

    onPreview = async (e) => {
      const item = e.detail.item;

      if (item.value === "deploy") {
        const response = await fetch(`/api/projects/${this.projectId}/deploy`);
        const result = await response.json();

        if (response.status >= 400) {
          const { message } = result;

          this.alertElement.value?.toast({
            type: "error",
            title: "An error occured",
            description: message,
          });
        } else {
          this.alertElement.value?.toast({
            type: "success",
            title: "Project deployed",
          });
        }
      } else if (item.value === "preview") {
        this.drawerElement.value?.show();
      }
    };

    onDeploymentSelect = (e) => {
      this._previewURL = e.detail.item.value;
    };

    render() {
      if (!this._deployments) return html`<slot></slot>`;

      const deployments = repeat(this._deployments, (d) => d.id, (d) => {
        if (!Array.isArray(d.domains)) return nothing;
        if (!d.domains[0]) return nothing;

        const domain = d.domains[0];
        return html`
        <sl-menu-item value="https://${domain}">${domain}</sl-menu-item>
        `;
      });

      // let previewURL = this._previewURL;

      // if (!previewURL) {
      //   const deployment = this._deployments.find((d) =>
      //     Array.isArray(d.domains) && d.domains[0]
      //   );
      //   const url = deployment?.domains[0];
      //   if (url) previewURL = `https://${url}`;
      // }

      const iframe = this._previewURL //&& this._drawerVisible
        ? html`<iframe src="${this._previewURL}"></iframe>`
        : nothing;

      return html`
      <sl-dropdown placement="bottom-start">
        <sl-button slot="trigger" caret>
          Actions
        </sl-button>

        <sl-menu @sl-select=${this.onPreview}>
          <sl-menu-item value="deploy">Deploy</sl-menu-item>
          <sl-menu-item value="preview">Preview</sl-menu-item>
        </sl-menu>
      </sl-dropdown>

      <sl-drawer ${ref(this.drawerElement)}>
        <sl-dropdown slot="label">
          <sl-button slot="trigger" caret>Deployments</sl-button>
          <sl-menu @sl-select=${this.onDeploymentSelect}>${deployments}</sl-menu>
        </sl-dropdown>
        ${iframe}
      </sl-drawer>

      <fu-alert ${ref(this.alertElement)}></fu-alert>
      `;
    }
  },
);
