interface IProject {
  id: string;
  name: string;
  description: string;
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

export async function getProjects(): Promise<IProject[]> {
  const r = await fetch("/api/project");
  const projects = await r.json();
  return projects;
}
