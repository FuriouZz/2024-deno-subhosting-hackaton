export function createProject(name) {
  return fetch("/api/project", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}
