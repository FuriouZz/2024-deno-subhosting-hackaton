/** @jsx jsx */
import { jsx } from "$hono/middleware.ts";
import { css, cx } from "$hono/helper/css/index.ts";
import SubhostingClient from "@/lib/SubhostingClient.ts";
import { IDeployment } from "@/lib/types.ts";
import PageList from "@/components/PageList.tsx";

const styl = {
  Root: css`
  box-sizing: border-box;
  width: 100%;
  min-height: 100%;
  padding: 2rem;
  `,

  Header: css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  `,

  Titles: css`
  & > * {
    margin: 0;
  }
  `,

  Form: css`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1.2rem;
  `,

  SplitPanel: css`
  width: 100%;
  height: 100%;
  `,

  Section: css`
  height: 100%;
  background: var(--sl-color-neutral-50);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  `,

  ErrorMessage: css`
  display: none;
  font-size: var(--sl-input-help-text-font-size-medium);
  color: var(--sl-color-danger-700);
  `,

  StartSection: css`
  overflow: auto;
  `,
};

export interface ProjectPageProps {
  projectId: string;
}

export default async function ProjectPage(props: ProjectPageProps) {
  const client = new SubhostingClient();
  const deployments: IDeployment[] = await (
    await client.listDeployments(props.projectId)
  ).json();

  const response = await client.getProject(props.projectId);
  const project = await response.json();

  return (
    <div class={styl.Root}>
      <sl-breadcrumb>
        <sl-breadcrumb-item href="/">
          <sl-icon slot="prefix" name="house"></sl-icon>Home
        </sl-breadcrumb-item>
        <sl-breadcrumb-item>Project</sl-breadcrumb-item>
      </sl-breadcrumb>
      <sl-divider></sl-divider>

      <div class={styl.Header}>
        <div class={styl.Titles}>
          <h1>Project: {project.name}</h1>
          <h4>ID: {project.id}</h4>
        </div>

        <fu-create-page-form>
          <sl-drawer slot="drawer" label="Drawer" class="drawer-overview">
            <form
              action={`/api/projects/${props.projectId}/pages`}
              method="POST"
              class={styl.Form}
            >
              <sl-input
                name="name"
                label="Name"
                placeholder="My page name"
                help-text="Set the name of your page"
                autofocus
                clearable
                required
              >
              </sl-input>

              <sl-select
                label="Page type"
                name="type"
                value="page"
                help-text="Is it a page or a blog post?"
                required
              >
                <sl-option value="page">Page</sl-option>
                <sl-option value="post">Post</sl-option>
              </sl-select>

              <span class={cx("error-message", styl.ErrorMessage)}></span>
              <sl-button type="submit" variant="primary">
                Create
              </sl-button>
            </form>

            <sl-button slot="footer" variant="primary">Close</sl-button>
          </sl-drawer>

          <sl-button slot="button" variant="primary">Create page</sl-button>
        </fu-create-page-form>
      </div>

      <sl-divider></sl-divider>

      <fu-page-list
        project-id={props.projectId}
      >
        <PageList projectId={props.projectId} />
      </fu-page-list>
    </div>
  );
}
