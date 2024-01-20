/** @jsx jsx */
import { Fragment, jsx } from "hono/middleware.ts";
import SubhostingClient from "@/lib/SubhostingClient.ts";
import { IProject } from "@/lib/types.ts";

export default async function ProjectList() {
  const client = new SubhostingClient();
  const projects: IProject[] = await (await client.listProjects()).json();

  return (
    <Fragment>
      {projects.map((project) => (
        <sl-option value={project.id}>
          {project.name}
        </sl-option>
      ))}
    </Fragment>
  );
}
