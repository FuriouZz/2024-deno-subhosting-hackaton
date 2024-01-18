import { Hono } from "$hono/mod.ts";
import SubhostingClient from "@/lib/SubhostingClient.ts";
import { PageModel } from "@/lib/models.ts";

const app = new Hono();
const client = new SubhostingClient();

// Get project list
app.get("/", async (ctx) => {
  const projects = await (await client.listProjects()).json();
  return ctx.json(projects);
});

// Create project for the given org with the Subhosting API
app.post("/", async (ctx) => {
  // const body = await ctx.req.parseBody();
  const body = await ctx.req.json();

  const pr = await client.createProject(body.name as string);
  const projectResponse = await pr.json();

  return ctx.json(projectResponse, pr.status);
});

app.post("/:projectId/page", async (ctx) => {
  const body = await ctx.req.parseBody<any>();
  const { projectId } = ctx.req.param();

  const result = await PageModel.post(projectId, {
    name: body.name,
    type: body.type,
    body: "",
  });

  return ctx.json(result);
});

app.put("/:projectId/page/:pageId", async (ctx) => {
  const body = await ctx.req.parseBody<any>();
  const { projectId, pageId } = ctx.req.param();

  const getresult = await PageModel.get(projectId, Number(pageId));

  const result = await PageModel.post(projectId, {
    ...getresult.value,
    name: body.name ?? getresult.value?.name,
    type: body.type ?? getresult.value?.type,
    body: body.body ?? getresult.value?.body,
  });

  return ctx.json(result);
});

export default app;
