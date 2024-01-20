/** @jsx jsx */
import { jsx } from "hono/middleware.ts";
import SubhostingClient from "@/lib/SubhostingClient.ts";
import { IDeployment, IProject } from "@/lib/types.ts";

export interface IHeaderProps {
  projectId?: string;
}

export default async function Header(props: IHeaderProps) {
  const client = new SubhostingClient();
  const projects: IProject[] = await (
    await client.listProjects()
  ).json();

  let deployments: IDeployment[] | undefined = undefined;
  if (props.projectId) {
    deployments = await (
      await client.listDeployments(props.projectId)
    ).json();
    deployments = deployments!.filter((d) =>
      Array.isArray(d.domains) && d.domains.length > 0
    );
  }

  return (
    <div>
      <fu-select placeholder="Select project..." value={props.projectId}>
        {projects.map((project) => (
          <sl-option value={project.id}>{project.name}</sl-option>
        ))}
      </fu-select>

      {deployments && (
        <sl-select>
          {deployments.map((deployment) => (
            <sl-option value={deployment.id}>
              {deployment.domains![0]}
            </sl-option>
          ))}
        </sl-select>
      )}
    </div>
  );
}
