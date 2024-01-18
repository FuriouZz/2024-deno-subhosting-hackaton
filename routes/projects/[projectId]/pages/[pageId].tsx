/** @jsx jsx */
import { jsx } from "$hono/middleware.ts";
import { PageModel } from "@/lib/models.ts";
import { css, cx } from "$hono/helper/css/index.ts";

export interface ProjectPageProps {
  projectId: string;
  pageId: string;
}

const styl = {
  Root: {
    height: "100%",
  },

  LeftPanel: {
    height: "100%",
    background: "var(--sl-color-neutral-50)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  RightPanel: {
    height: "100%",
  },

  PanelItem: {
    height: "100%",
    background: "var(--sl-color-neutral-50)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  PanelTopItem: {},
  PanelBottomItem: {
    height: "100%",
  },

  ErrorMessage: css`
  display: none;
  font-size: var(--sl-input-help-text-font-size-medium);
  color: var(--sl-color-danger-700);
  `,
};

export default async function ProjectPage(props: ProjectPageProps) {
  const result = await PageModel.get(props.projectId, Number(props.pageId));
  const page = result.value!;

  return (
    <div>
      <sl-split-panel position-in-pixels="50" vertical style={styl.Root}>
        <div
          slot="start"
          style={styl.LeftPanel}
        >
          <sl-button href={`/projects/${props.projectId}`}>
            {"<"} Back to pages
          </sl-button>
          <fu-save-page-form>
            <form
              action={`/api/project/${props.projectId}/page/${props.pageId}`}
              method="PUT"
              id="save-page"
            >
              <input type="hidden" name="_method" value="put" />
              <span class={cx("error-message", styl.ErrorMessage)}></span>
              <sl-button type="submit" variant="primary">Save</sl-button>
            </form>
          </fu-save-page-form>
        </div>
        <sl-split-panel slot="end">
          <fu-editor slot="start" form-selector="#save-page">
            <template dangerouslySetInnerHTML={{ __html: page.body }}>
            </template>
          </fu-editor>
          <sl-split-panel
            slot="end"
            position-in-pixels="50"
            vertical
            disabled
            style={styl.RightPanel}
          >
            <div
              slot="start"
              style={styl.PanelTopItem}
            >
              Top
            </div>
            <div
              slot="end"
              style={styl.PanelBottomItem}
            >
              Bottom
            </div>
          </sl-split-panel>
        </sl-split-panel>
      </sl-split-panel>
    </div>
  );
}
