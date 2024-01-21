import { css, html, LitElement, nothing } from "lit";
import { createRef, ref } from "lit/directives/ref.js";
import { milliseconds } from "@/islands/lib/utils.js";

const styles = css`
:host {
  display: block;
}

.edit-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

.editor-container {
  position: relative;
}
`;

globalThis.customElements.define(
  "fu-save-page-form",
  class extends LitElement {
    static styles = styles;

    static properties = {
      delay: { type: Number },
      pageId: { attribute: "page-id" },
      projectId: { attribute: "project-id" },
      iframeSelector: { attribute: "iframe-selector" },
      _body: { type: String },
      _changed: { type: Boolean },
    };

    constructor() {
      super();
      this.delay = 3000;
    }

    _id = -1;

    /** @type {import("lit/directives/ref.js").Ref<HTMLElement>} */
    alertElement = createRef();

    /** @type {import("lit/directives/ref.js").Ref<HTMLSlotElement>} */
    drawerSlot = createRef();

    /** @type {import("lit/directives/ref.js").Ref<HTMLSlotElement>} */
    pageBodySlot = createRef();

    /** @type {import("lit/directives/ref.js").Ref<HTMLFormElement>} */
    formElement = createRef();

    editorElement = createRef();

    firstUpdated() {
      // CMD/Ctrl + S
      globalThis.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          this.publish();
        }
      });

      // Listen input changes
      const drawer =
        this.drawerSlot.value.assignedElements({ flatten: true })[0];

      const elements = drawer.querySelectorAll(
        "[data-input-change]",
      );

      elements.forEach((element) => {
        element.addEventListener("sl-input", this.triggerChange);

        this.formElement.value.addEventListener("formdata", (e) => {
          const data = e.formData;
          if (element.name === "draft") {
            data.set(element.name, element.checked);
          } else {
            data.set(element.name, element.value);
          }
        });
      });

      // Listen delete button
      drawer
        .querySelector("sl-button[variant=danger]")
        .addEventListener("click", this.onDeletePage);
    }

    onSubmit = (e) => {
      e.preventDefault();
      this.publish();
    };

    triggerChange = () => {
      this._changed = true;
      clearTimeout(this._id);
      this._id = setTimeout(() => this.publish(), this.delay);
    };

    async publish() {
      if (!this._changed) return;
      this._changed = false;

      const form = this.formElement.value;
      if (!form) return;

      const tab = document.querySelector("#saving-tab");
      if (tab) tab.style.display = "block";

      const body = new FormData(form);
      body.set(
        "body",
        this.editorElement.value.view.state.doc.toString(),
      );

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

        /** @type {HTMLIFrameElement} */
        const iframe = this.parentElement?.querySelector(this.iframeSelector);
        if (iframe) {
          const page = await response.json();
          const src = `/lume/${page.type}s/${page.slug}`;
          if (iframe.src === src) {
            iframe.contentWindow.location.reload();
          } else {
            iframe.src = src;
          }
        }
      } finally {
        await milliseconds(500);
        if (tab) tab.style.display = "";
      }
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

    openDrawer = () => {
      this.drawerSlot.value
        ?.assignedElements({
          flatten: true,
        })[0]
        ?.show?.();
    };

    render() {
      return html`
      <form
        action="${`/api/projects/${this.projectId}/pages/${this.pageId}`}"
        method="POST"
        id="save-page"
        style="height: 100%;"
        @submit=${this.onSubmit}
        ${ref(this.formElement)}
      >
        <input type="hidden" name="_method" value="put" />

        <div class="editor-container">
          <fu-editor @sl-input=${this.triggerChange} ${ref(this.editorElement)}>
            <slot name="page-body"></slot>
          </fu-editor>

          <sl-button
            class="edit-button"
            size="small"
            @click="${this.openDrawer}"
          >
            Edit metadata
          </sl-button>

          <slot name="drawer" ${ref(this.drawerSlot)}></slot>
        </div>
      </form>

      <fu-alert ${ref(this.alertElement)}></fu-alert>
      `;
    }
  },
);
