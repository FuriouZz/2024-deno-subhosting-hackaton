export async function createProject(name) {
  const response = await fetch("/api/project", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  return response.json();
}

export async function getProjects() {
  const response = await fetch("/api/project");
  return response.json();
}
