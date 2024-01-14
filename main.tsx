/** @jsx jsx */
import { Hono } from "$hono/mod.ts";
import { jsx } from "$hono/jsx/index.ts";
import { serveStatic } from "$hono/middleware.ts";
import App from "./App.tsx";
import Client from "./subhosting.ts";
import build from "./lume/build.ts";

const shc = new Client();
const app = new Hono();

app.get("/", async (c) => {
  const projects = await (await shc.listProjects()).json();
  return c.html(<App projects={projects} />);
});

// Poll deployment data from Subhosting API
app.get("/deployments", async (c) => {
  const projectId = c.req.query("projectId") || "";
  const dr = await shc.listDeployments(projectId, {
    order: "desc",
  });
  const deployments = await dr.json();
  return c.json(deployments);
});

// Create deployment for the given project with the Subhosting API
app.post("/deployment", async (c) => {
  const body = await c.req.json();

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
  const dr = await shc.createDeployment(body.projectId, {
    entryPointUrl: "main.ts",
    assets,
    envVars: {},
  });

  const deploymentResponse = await dr.json();
  return c.json(deploymentResponse);
});

// Create project for the given org with the Subhosting API
app.post("/project", async (c) => {
  const body = await c.req.parseBody();

  const pr = await shc.createProject(body.name as string);
  const projectResponse = await pr.json();
  console.log(projectResponse);

  return c.redirect("/");
});

app.use("/*", serveStatic({ root: "./static" }));

Deno.serve(app.fetch);
