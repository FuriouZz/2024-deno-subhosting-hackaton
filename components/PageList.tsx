/** @jsx jsx */
import { Fragment, jsx } from "$hono/middleware.ts";
import SubhostingClient from "@/lib/SubhostingClient.ts";
import { IPage } from "@/lib/types.ts";
import { PageModel } from "@/lib/models.ts";

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
          <a href={`/projects/${props.projectId}/pages/${page.id}`}>
            {page.name}
          </a>
          <sl-divider></sl-divider>
        </Fragment>
      ))}
    </Fragment>
  );
}
