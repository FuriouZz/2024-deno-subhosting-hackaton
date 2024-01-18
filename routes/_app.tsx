/** @jsx jsx */
import { jsx } from "$hono/middleware.ts";
import { Context } from "$hono/mod.ts";
import { Style } from "$hono/helper/css/index.ts";

export interface IAppProps {
  Component: () => JSX.Element;
  context: Context;
}

export default async function App({ Component, context }: IAppProps) {
  const params = context.req.param();
  const importMap = await Deno.readTextFile("./static/import_map.json");

  return (
    <html>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/themes/light.css"
        />
        <link
          rel="stylesheet"
          href="/main.css"
        />
        <script
          type="importmap"
          dangerouslySetInnerHTML={{ __html: importMap }}
        >
        </script>
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.12.0/cdn/shoelace.js"
        >
        </script>
        <Style />
      </head>
      <body>
        <Component {...params} />
        {/* <script src="live-reload.js"></script> */}
        <script async type="module" src="/main.js"></script>
      </body>
    </html>
  );
}
