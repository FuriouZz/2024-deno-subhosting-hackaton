import {
  Decoration,
  MatchDecorator,
  ViewPlugin,
  WidgetType,
} from "@codemirror/view/dist/index.js";
import { EditorView } from "@codemirror/codemirror/dist/index.js";

class StrikeThroughWidget extends WidgetType {
  constructor(visibleVal) {
    super();
    this.visibleVal = visibleVal;
  }
  eq(other) {
    return this.visibleVal === other.visibleVal;
  }
  toDOM() {
    const span = document.createElement("span");
    span.className = "cm-strikethrough";
    const substring = document.createElement("s");
    substring.innerText = this.visibleVal;
    span.appendChild(substring);
    return span;
  }
  ignoreEvent() {
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
    constructor(view) {
      this.foldedStrikeTags = strikeTagMatcher.createDeco(view);
    }

    update(update) {
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
