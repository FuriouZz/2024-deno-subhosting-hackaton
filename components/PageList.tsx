/** @jsx jsx */
import { Fragment, jsx } from "$hono/middleware.ts";
import { IPage } from "@/lib/types.ts";
import { PageModel } from "@/lib/models.ts";
import { css } from "$hono/helper/css/index.ts";

const styl = {
  Anchor: css`
  font-size: var(--sl-font-size-x-large);
  `,
};

export interface PageListProps {
  projectId: string;
}

export default async function PageList(props: PageListProps) {
  const it = PageModel.all(props.projectId);
  const pages: IPage[] = [];
  for await (const res of it) pages.push(res.value);

  return (
    <Fragment>
      {pages.map((page) => (
        <Fragment>
          <a
            class={styl.Anchor}
            href={`/projects/${props.projectId}/pages/${page.id}`}
          >
            {page.name}
          </a>
          <sl-divider></sl-divider>
        </Fragment>
      ))}
    </Fragment>
  );
}
