/** @jsx jsx */
import { jsx } from "hono/middleware.ts";
import SubhostingClient from "@/lib/SubhostingClient.ts";
import { IDeployment, IProject } from "@/lib/types.ts";

export interface IDeploymentListProps {
  projectId?: string;
}

export default async function DeploymentList(props: IDeploymentListProps) {
  const client = new SubhostingClient();

  let deployments: IDeployment[] = [];
  if (props.projectId) {
    deployments = await (
      await client.listDeployments(props.projectId)
    ).json();
    deployments = deployments!.filter((d) =>
      Array.isArray(d.domains) && d.domains.length > 0
    );
  }

  return (
    <sl-select>
      {deployments.map((deployment) => (
        <sl-option value={deployment.id}>
          {deployment.domains![0]}
        </sl-option>
      ))}
    </sl-select>
  );
}
