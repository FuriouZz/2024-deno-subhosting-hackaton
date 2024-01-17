import { Hono } from "$hono/mod.ts";
import Client from "server/subhosting.ts";

const app = new Hono();
const client = new Client();

// Get project list
app.get("/", async (ctx) => {
  const projects = await (await client.listProjects()).json();
  return ctx.json(projects);
});

// Create project for the given org with the Subhosting API
app.post("/", async (ctx) => {
  const body = await ctx.req.parseBody();

  const pr = await client.createProject(body.name as string);
  const projectResponse = await pr.json();
  console.log(projectResponse);

  return ctx.json(projectResponse);
});

export default app;
