/** @jsx jsx */
import { jsx } from "$hono/middleware.ts";
import { PageModel } from "@/lib/models.ts";
import { css, cx } from "$hono/helper/css/index.ts";

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
  --min: 350px;
  --max: calc(100% - 350px);
  --divider-width: 20px;
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
  `,

  IFrame: css`
  width: 100%;
  height: 100%;
  border: 0;
  `,
};

export default async function ProjectPage(props: ProjectPageProps) {
  const result = await PageModel.get(props.projectId, Number(props.pageId));
  const page = result.value!;

  return (
    <div class={styl.Root}>
      <div class={styl.Header}>
        <sl-breadcrumb>
          <sl-breadcrumb-item href="/">
            <sl-icon slot="prefix" name="house"></sl-icon>Home
          </sl-breadcrumb-item>
          <sl-breadcrumb-item href={`/projects/${props.projectId}`}>
            Project
          </sl-breadcrumb-item>
          <sl-breadcrumb-item>
            {page.type[0].toUpperCase() + page.type.slice(1)}
            <sl-dropdown slot="suffix" placement="bottom-start">
              <sl-button slot="trigger" size="small" circle>
                <span style="display: inline-block; width: 0px; visibility: hidden; ">
                  a
                </span>
                <sl-icon label="More options" name="three-dots"></sl-icon>
              </sl-button>
              <sl-menu>
                <sl-menu-item>Deploy</sl-menu-item>
                <sl-menu-item>Preview</sl-menu-item>
              </sl-menu>
            </sl-dropdown>
          </sl-breadcrumb-item>
        </sl-breadcrumb>
        <sl-divider></sl-divider>
      </div>

      <sl-split-panel class={styl.Body}>
        <sl-icon slot="divider" name="grip-vertical"></sl-icon>

        <fu-save-page-form
          slot="start"
          page-id={props.pageId}
          project-id={props.projectId}
          class={styl.Form}
          style="height: 100%;"
        >
          <form
            action={`/api/projects/${props.projectId}/pages/${props.pageId}`}
            method="POST"
            id="save-page"
            style="height: 100%;"
          >
            <input type="hidden" name="_method" value="put" />

            <sl-tab-group style="height: 100%;">
              <sl-tab slot="nav" panel="editor" active>Editor</sl-tab>
              <sl-tab slot="nav" panel="metadata">Metadata</sl-tab>
              <sl-tab
                slot="nav"
                panel="metadata"
                class={cx("saving-tab", styl.SavingTab)}
                disabled
              >
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                  <span>Saving...</span>
                  <sl-spinner></sl-spinner>
                </div>
              </sl-tab>

              <sl-tab-panel name="editor" class={styl.EditorPanel}>
                <fu-editor form-selector="#save-page">
                  <template
                    dangerouslySetInnerHTML={{ __html: page.body }}
                  />
                </fu-editor>
              </sl-tab-panel>

              <sl-tab-panel name="metadata">
                <div class={styl.Inputs}>
                  <sl-input
                    name="name"
                    label="Name"
                    placeholder="My page name"
                    value={page.name}
                    autofocus
                    required
                  >
                  </sl-input>

                  <sl-select
                    label="Page type"
                    name="type"
                    value={page.type}
                    required
                  >
                    <sl-option value="page">Page</sl-option>
                    <sl-option value="post">Post</sl-option>
                  </sl-select>

                  <span class={cx("error-message", styl.ErrorMessage)}>
                  </span>

                  <sl-button type="submit" variant="primary">Save</sl-button>
                  <sl-button variant="danger" outline>Delete</sl-button>
                </div>
              </sl-tab-panel>
            </sl-tab-group>
          </form>
        </fu-save-page-form>

        <div slot="end">
          <iframe class={styl.IFrame} src="https://blog.chrsmsln.com/">
          </iframe>
        </div>
      </sl-split-panel>
    </div>
  );
}
