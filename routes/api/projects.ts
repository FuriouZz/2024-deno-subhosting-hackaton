import { Hono } from "$hono/mod.ts";
import { streamSSE } from "$hono/helper/streaming/sse.ts";
import SubhostingClient from "@/lib/SubhostingClient.ts";
import { PageModel } from "@/lib/models.ts";
import { watchPages } from "@/lib/models.ts";

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

app.get("/:projectId/pages/sse", async (ctx) => {
  const { projectId } = ctx.req.param();

  return streamSSE(ctx, async (stream) => {
    let id = 0;
    await watchPages(projectId, async (pages) => {
      await stream.writeSSE({
        data: JSON.stringify(pages),
        event: "change",
        id: String(++id),
      });
    });
  });
});

app.post("/:projectId/pages", async (ctx) => {
  const body = await ctx.req.parseBody<any>();
  const { projectId } = ctx.req.param();

  const result = await PageModel.post(projectId, {
    name: body.name,
    type: body.type,
    body: ``,
  });

  return ctx.json(result);
});

app.put("/:projectId/pages/:pageId", async (ctx) => {
  const body = await ctx.req.parseBody<any>();
  const { projectId, pageId } = ctx.req.param();

  const getresult = await PageModel.get(projectId, Number(pageId));

  const result = await PageModel.put(projectId, Number(pageId), {
    ...getresult.value,
    name: body.name ?? getresult.value?.name,
    type: body.type ?? getresult.value?.type,
    body: body.body ?? getresult.value?.body,
  });

  return ctx.json(result);
});

app.delete("/:projectId/pages/:pageId", async (ctx) => {
  const { projectId, pageId } = ctx.req.param();

  try {
    await PageModel.delete(projectId, Number(pageId));
    return ctx.json({ success: true, message: "Page deleted with success" });
  } catch (e) {
    console.log(e);
    return ctx.json({ success: false, message: "An error occured" }, 400);
  }
});

export default app;
