/** @jsx jsx */
import { jsx } from "$hono/middleware.ts";
import { css, cx } from "$hono/helper/css/index.ts";
import SubhostingClient from "@/lib/SubhostingClient.ts";
import { IDeployment } from "@/lib/types.ts";
import PageList from "@/components/PageList.tsx";

const styl = {
  Root: css`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 1.2rem;
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

  return (
    <div class={styl.Root}>
      <sl-split-panel class={styl.SplitPanel} disabled>
        <div slot="start" class={cx(styl.Section, styl.StartSection)}>
          <div>
            <sl-button href="/">{"<"} Back to projects</sl-button>
            <br />
            <PageList projectId={props.projectId} />
          </div>
        </div>
        <div slot="end" class={styl.Section}>
          <fu-create-page-form>
            <form
              action={`/api/project/${props.projectId}/page`}
              method="POST"
              class={styl.Form}
            >
              <sl-input
                name="name"
                label="Name"
                placeholder="My page name"
                help-text="Set the name of your page"
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
                Create page
              </sl-button>
            </form>
          </fu-create-page-form>
        </div>
      </sl-split-panel>
    </div>
  );
}
