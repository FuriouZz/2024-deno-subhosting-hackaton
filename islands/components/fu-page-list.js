import { css, html, LitElement } from "lit";
import { repeat } from "lit/directives/repeat.js";
import { createRef, ref } from "lit/directives/ref.js";
import { createEffect } from "@furiouzz/reactive";
import { PagesSignal } from "@/islands/lib/store.js";

const styles = css`
:host {
  display: block;
  min-width: 400px;
}

a {
  font-size: var(--sl-font-size-x-large);
}

ul {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

li.project {
  display: flex;
  justify-content: space-between;
}

sup {
  font-size: var(--sl-font-size-x-small);
}
`;

globalThis.customElements.define(
  "fu-page-list",
  class extends LitElement {
    static styles = styles;

    static properties = {
      projectId: { attribute: "project-id" },
      _pages: {},
    };

    buttonRef = createRef();
    alertElement = createRef();

    firstUpdated() {
      createEffect(() => this._pages = PagesSignal());

      this.buttonRef.value?.addEventListener("click", () => {
        this.deletePage();
      });
    }

    /**
     * @param {string} id
     */
    async onDeletePage(id) {
      const response = await fetch(
        `/api/projects/${this.projectId}/pages/${id}`,
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
      }
    }

    render() {
      if (!this._pages) return html`<slot></slot>`;

      if (this._pages.length === 0) {
        return html`No page found.`;
      }

      const content = repeat(this._pages, (page) => page.id, (page) => {
        return html`
          <li class="project">
            <a href="/projects/${this.projectId}/pages/${page.id}">
              <sl-icon name="file-earmark" style="font-size: 16px"></sl-icon>
              ${page.name}<sup>#${page.id}</sup>
            </a>
            <sl-tooltip content="Delete">
              <sl-icon-button name="x-lg" label="Delete" @click=${() =>
          this.onDeletePage(page.id)}></sl-icon>
            </sl-tooltip>
          </li>
          <li>
            <sl-divider></sl-divider>
          </lit>
        `;
      });

      return html`
        <ul>${content}</ul>
        <fu-alert ${ref(this.alertElement)}></fu-alert>
      `;
    }
  },
);
