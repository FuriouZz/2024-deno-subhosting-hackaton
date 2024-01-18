/** @jsx jsx */
import { jsx } from "$hono/middleware.ts";
import ProjectList from "@/components/ProjectList.tsx";
import { css, cx } from "$hono/helper/css/index.ts";

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

export default function IndexPage() {
  return (
    <div class={styl.Root}>
      <sl-split-panel class={styl.SplitPanel} disabled>
        <div slot="start" class={cx(styl.Section, styl.StartSection)}>
          <fu-select-project-form>
            <form class={styl.Form}>
              <sl-select
                name="project"
                placeholder="Select project..."
                clearable
                required
              >
                <ProjectList />
              </sl-select>
              <sl-button type="submit" variant="primary">
                Select project
              </sl-button>
            </form>
          </fu-select-project-form>
        </div>
        <div slot="end" class={styl.Section}>
          <fu-create-project-form>
            <form action="/api/project" method="POST" class={styl.Form}>
              <sl-input
                name="name"
                label="Name"
                placeholder="my-project-name"
                help-text="Set the name of your project"
                clearable
                required
              >
              </sl-input>
              <span class={cx("error-message", styl.ErrorMessage)}></span>
              <sl-button type="submit" variant="primary">
                Create project
              </sl-button>
            </form>
          </fu-create-project-form>
        </div>
      </sl-split-panel>
    </div>
  );
}
