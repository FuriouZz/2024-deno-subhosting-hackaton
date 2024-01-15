export async function deploy(projectId: string, code: string) {
  const response = await fetch("/deployment", {
    method: "POST",
    body: JSON.stringify({ projectId, code })
  })
  response.json()
}
