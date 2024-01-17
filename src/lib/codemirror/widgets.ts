import {
  Decoration,
  DecorationSet,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
  WidgetType,
} from "@codemirror/view";
import { EditorView } from "codemirror";

class StrikeThroughWidget extends WidgetType {
  constructor(readonly visibleVal: string) {
    super();
  }
  eq(other: StrikeThroughWidget) {
    return this.visibleVal === other.visibleVal;
  }
  toDOM(): HTMLElement {
    const span = document.createElement("span");
    span.className = "cm-strikethrough";
    const substring = document.createElement("s");
    substring.innerText = this.visibleVal;
    span.appendChild(substring);
    return span;
  }
  ignoreEvent(): boolean {
    return false;
  }
}

const strikeTagMatcher = new MatchDecorator({
  regexp: /~~(.*?)~~/g,
  decoration(match) {
    const strikeThrough = new StrikeThroughWidget(match[1]);
    return Decoration.widget({ widget: strikeThrough });
  },
});

export const FoldStrikeTags = ViewPlugin.fromClass(
  class {
    foldedStrikeTags: DecorationSet;
    constructor(view: EditorView) {
      this.foldedStrikeTags = strikeTagMatcher.createDeco(view);
    }

    update(update: ViewUpdate) {
      this.foldedStrikeTags = strikeTagMatcher.createDeco(update.view);

      for (const range of update.state.selection.ranges) {
        this.foldedStrikeTags = this.foldedStrikeTags.update({
          filter(from, to, _value) {
            return to < range.from || from > range.to;
          },
        });
      }
    }
  },
  {
    decorations: (instance) => instance.foldedStrikeTags,
    provide: (plugin) =>
      EditorView.decorations.of((view) => {
        return view.plugin(plugin)?.foldedStrikeTags || Decoration.none;
      }),
  },
);
