import { css, LitElement } from "lit";
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

    connectedCallback() {
      super.connectedCallback();

      new EditorView({
        extensions: [basicSetup, markdown(), FoldStrikeTags],
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
  },
);
