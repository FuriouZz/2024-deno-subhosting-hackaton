export interface IProject {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IDeployment {
  id: string;
  projectId: string;
  domains?: string[];
  description: string;
  status: string;
  databases: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export async function deploy(projectId: string, code: string) {
  const response = await fetch("/deployment", {
    method: "POST",
    body: JSON.stringify({ projectId, code }),
  });
  response.json();
}

export async function getProject(projectId: string): Promise<IProject[]> {
  const r = await fetch(`/api/project/${projectId}`);
  const projects = await r.json();
  return projects;
}

export async function getProjects(): Promise<IProject[]> {
  const r = await fetch("/api/project");
  const projects = await r.json();
  return projects;
}

export async function getDeployments(
  projectId: string,
): Promise<IDeployment[]> {
  const r = await fetch(`/api/deployment?projectId=${projectId}`);
  const projects = await r.json();
  return projects;
}
