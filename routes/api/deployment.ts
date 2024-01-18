import { Hono } from "$hono/mod.ts";
import build from "@/lib/lume/build.ts";
import SubhostingClient from "@/lib/SubhostingClient.ts";

const app = new Hono();
const client = new SubhostingClient();

// Poll deployment data from Subhosting API
app.get("/", async (ctx) => {
  const projectId = ctx.req.query("projectId") || "";
  const dr = await client.listDeployments(projectId, {
    order: "desc",
  });
  const deployments = await dr.json();
  return ctx.json(deployments);
});

// Create deployment for the given project with the Subhosting API
app.post("/", async (ctx) => {
  const body = await ctx.req.json();

  const assets = await build({
    themeURL: "https://deno.land/x/furiouzz@0.0.12/lume-blog-theme/mod.ts",
    pages: {
      "/post/": {
        body: body.code,
        type: "post",
      },
    },
  });

  // return new Response("cool");
  const dr = await client.createDeployment(body.projectId, {
    entryPointUrl: "main.ts",
    assets,
    envVars: {},
  });

  const deploymentResponse = await dr.json();
  return ctx.json(deploymentResponse);
});

export default app;
