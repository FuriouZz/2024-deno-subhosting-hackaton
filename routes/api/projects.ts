import { Hono } from "hono/mod.ts";
import { streamSSE } from "hono/helper/streaming/sse.ts";
import createSlugifier from "lume/core/slugifier.ts";
import SubhostingClient from "@/lib/SubhostingClient.ts";
import { PageModel, updateDeployments } from "@/lib/models.ts";
import { watchProject } from "@/lib/models.ts";
import { IPage } from "@/lib/types.ts";
import build from "@/lib/lume/build.ts";

const app = new Hono();
const client = new SubhostingClient();
const slug = createSlugifier();

async function getPages(projectId: string) {
  const pages = await PageModel.allArray(projectId);
  return Object.fromEntries(pages.map((page) => [
    `/${page.type}s/${slug(page.name)}/`,
    {
      body: page.body,
      type: page.type,
      title: page.name,
    },
  ]));
}

// Get project list
app.get("/", async (ctx) => {
  const projects = await (await client.listProjects()).json();
  return ctx.json(projects);
});

// Create project for the given org with the Subhosting API
app.post("/", async (ctx) => {
  const body = await ctx.req.json();

  const pr = await client.createProject(body.name as string);
  const projectResponse = await pr.json();

  return ctx.json(projectResponse, pr.status);
});

app.get("/:projectId/sse", (ctx) => {
  const { projectId } = ctx.req.param();

  return streamSSE(ctx, async (stream) => {
    let id = 0;
    await watchProject(projectId, {
      onPageChanges: async (pages) => {
        await stream.writeSSE({
          data: JSON.stringify(pages),
          event: "pages_change",
          id: String(++id),
        });
      },
      onDeploymentChanges: async (entries) => {
        await stream.writeSSE({
          data: JSON.stringify(entries),
          event: "deployments_change",
          id: String(++id),
        });
      },
    });
  });
});

app.post("/:projectId/pages", async (ctx) => {
  const body = await ctx.req.parseBody<any>();
  const { projectId } = ctx.req.param();

  const result = await PageModel.post(projectId, {
    name: body.name,
    slug: slug(body.name),
    type: body.type,
    body: ``,
    draft: true,
  });

  return ctx.json(result);
});

app.put("/:projectId/pages/:pageId", async (ctx) => {
  const body = await ctx.req.parseBody<any>();
  const { projectId, pageId } = ctx.req.param();

  const getresult = await PageModel.get(projectId, Number(pageId));

  const page = {
    ...getresult.value,
    name: body.name ?? getresult.value?.name,
    type: body.type ?? getresult.value?.type,
    body: body.body ?? getresult.value?.body,
    draft: body.draft ?? getresult.value?.draft,
  } satisfies Partial<IPage>;

  page.slug = slug(page.name);

  // Update page
  await PageModel.put(projectId, Number(pageId), page);

  // Build preview
  await build({
    mode: "preview",
    themeURL: "https://deno.land/x/furiouzz@0.0.12/lume-blog-theme/mod.ts",
    pages: await getPages(projectId),
  });

  return ctx.json(page);
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

app.get("/:projectId/deploy", async (ctx) => {
  const { projectId } = ctx.req.param();

  const assets = await build({
    mode: "assets",
    themeURL: "https://deno.land/x/furiouzz@0.0.12/lume-blog-theme/mod.ts",
    pages: await getPages(projectId),
  });

  const dr = await client.createDeployment(projectId, {
    entryPointUrl: "main.ts",
    assets,
    envVars: {},
  });

  const deploymentResponse = await dr.json();
  const response = await client.listDeployments(projectId, {
    order: "desc",
  });
  await updateDeployments(projectId, await response.json());

  return ctx.json(deploymentResponse);
});

export default app;
