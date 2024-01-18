export function createProject(name) {
  return fetch("/api/project", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export function createPage(name, type) {
  return fetch("/api/page", {
    method: "POST",
    body: JSON.stringify({ name, type, body: "my content" }),
  });
}
