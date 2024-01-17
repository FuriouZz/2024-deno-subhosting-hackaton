import { basicSetup, EditorView } from "codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { useCallback, useEffect, useRef, useState } from "react";
import { FoldStrikeTags } from "./widgets.ts";
import useResize from "../../hooks/useResize.ts";

export default function Editor() {
  const parentEl = useRef<HTMLDivElement | null>(null);
  const [view, setView] = useState<EditorView>();

  const onResize = useCallback(() => {
  }, [view]);

  useResize(onResize);

  useEffect(() => {
    if (view) view.destroy();
    const v = new EditorView({
      extensions: [basicSetup, markdown(), FoldStrikeTags],
      parent: parentEl.current!,
      doc: `
# hello
world **MF** *plouf*
---
lol
~~yolo~~
      `,
    });

    v.dom.classList.add("min-h-screen");
    setView(v);
  }, []);

  return <div ref={parentEl} className="w-full h-full"></div>;
}
