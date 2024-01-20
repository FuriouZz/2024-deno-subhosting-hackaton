import { css, html, LitElement } from "lit";
import { basicSetup, EditorView } from "@codemirror/codemirror/dist/index.js";
import { markdown } from "@codemirror/lang-markdown/dist/index.js";
import { FoldStrikeTags } from "../codemirror/widget.js";

const styles = css`
:host {
  width: 100%;
  height: 100%;
}

.cm-editor {
  width: 100%;
  height: 100%;
}
`;

globalThis.customElements.define(
  "fu-editor",
  class Editor extends LitElement {
    static styles = styles;

    static properties = {
      formSelector: { attribute: "form-selector", type: String },
    };

    firstUpdated() {
      this.view = new EditorView({
        extensions: [
          basicSetup,
          markdown(),
          FoldStrikeTags,
          EditorView.updateListener.of((v) => {
            if (v.docChanged) {
              // Document changed
              this.dispatchEvent(new CustomEvent("sl-input"));
            }
          }),
        ],
        parent: this.renderRoot,
        doc: `
        # hello
        world **MF** *plouf*
        ---
        lol
        ~~yolo~~
            `,
      });
    }

    updated() {
      const form = document.querySelector(this.formSelector);
      form?.addEventListener("formdata", (e) => {
        /** @type {FormData} */
        const data = e.formData;
        data.set("body", this.view.state.doc.toString());
      });
    }

    onSlotChange(e) {
      const nodes = e.currentTarget.assignedNodes({ flatten: true });
      const template = nodes.find((node) =>
        node instanceof HTMLTemplateElement
      );

      this.view.dispatch({
        changes: {
          from: 0,
          to: this.view.state.doc.length,
          insert: template.content.textContent,
        },
      });
    }

    render() {
      return html`<slot @slotchange=${this.onSlotChange}></slot>`;
    }
  },
);
