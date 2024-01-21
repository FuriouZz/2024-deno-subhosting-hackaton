/** @jsx jsx */
import { jsx } from "hono/middleware.ts";
import { PageModel } from "@/lib/models.ts";
import { css, cx } from "hono/helper/css/index.ts";

export interface ProjectPageProps {
  projectId: string;
  pageId: string;
}

const styl = {
  Root: css`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  `,

  Header: css`
  padding: 2rem;
  padding-bottom: 0;
  `,

  Body: css`
  --min: 25%;
  --max: calc(100% - 350px);
  --divider-width: 10px;
  --divider-hit-area: 40px;
  flex: 1;
  `,

  ErrorMessage: css`
  display: none;
  font-size: var(--sl-input-help-text-font-size-medium);
  color: var(--sl-color-danger-700);
  `,

  Form: css`
  height: 100%;
  form, sl-split-panel[vertical] {
    height: 100%;
  }

  sl-tab-group::part(base),
  sl-tab-group::part(body) {
    height: 100%;
  }
  `,

  EditorPanel: css`
  &::part(base) {
    padding: 0;
  }
  `,

  Inputs: css`
  padding: 0 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  `,

  SavingTab: css`
  display: none;

  & > div {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  & > div > span {
    font-size: var(--sl-font-size-small);
  }
  `,

  IFrame: css`
  width: 100%;
  height: 100%;
  border: 0;
  `,

  EditButton: css`
  position: absolute;
  top: 1rem;
  right: 1rem;
  `,

  EditorContainer: css`
  position: relative;
  `,
};

export default async function ProjectPage(props: ProjectPageProps) {
  const result = await PageModel.get(props.projectId, Number(props.pageId));
  const page = result.value!;

  return (
    <div class={styl.Root}>
      <div class={styl.Header}>
        <div style="display: flex; justify-content: space-between">
          <sl-breadcrumb>
            <sl-breadcrumb-item href="/">
              <sl-icon slot="prefix" name="house"></sl-icon>Home
            </sl-breadcrumb-item>
            <sl-breadcrumb-item href={`/projects/${props.projectId}`}>
              Project
            </sl-breadcrumb-item>
            <sl-breadcrumb-item>
              {page.type[0].toUpperCase() + page.type.slice(1)}
            </sl-breadcrumb-item>
          </sl-breadcrumb>

          <div
            slot="suffix"
            id="saving-tab"
            class={styl.SavingTab}
          >
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <span>
                Saving...
              </span>
              <sl-spinner size="small"></sl-spinner>
            </div>
          </div>
        </div>

        <sl-divider></sl-divider>
      </div>

      <sl-split-panel class={styl.Body} snap="25% 50% 75%">
        <sl-icon slot="divider" name="grip-vertical"></sl-icon>

        <fu-save-page-form
          slot="start"
          page-id={props.pageId}
          project-id={props.projectId}
          iframe-selector=".preview"
          class={styl.Form}
        >
          <template
            slot="page-body"
            dangerouslySetInnerHTML={{ __html: page.body }}
          />

          <sl-drawer slot="drawer">
            <div class={styl.Inputs}>
              <sl-input
                name="name"
                label="Name"
                placeholder="My page name"
                value={page.name}
                data-input-change
                autofocus
                required
              >
              </sl-input>

              <sl-select
                label="Page type"
                name="type"
                data-input-change
                value={page.type}
                required
              >
                <sl-option value="page">Page</sl-option>
                <sl-option value="post">Post</sl-option>
              </sl-select>

              <sl-checkbox
                name="draft"
                data-input-change
                checked={page.draft}
              >
                Draft
              </sl-checkbox>

              <span class={cx("error-message", styl.ErrorMessage)}></span>

              <sl-button variant="danger" outline>Delete</sl-button>
            </div>
          </sl-drawer>
        </fu-save-page-form>

        <div slot="end">
          <iframe
            class={cx(styl.IFrame, "preview")}
            src={`/lume/${page.type}s/${page.slug}`}
          >
          </iframe>
        </div>
      </sl-split-panel>

      <fu-project-sse project-id={props.projectId}></fu-project-sse>
    </div>
  );
}
