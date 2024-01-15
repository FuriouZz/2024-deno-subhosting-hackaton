interface IAppProps {
  // deno-lint-ignore no-explicit-any
  Component?: any;
  projects?: { id: string; name: string }[];
}

export default function App({ Component, ...props }: IAppProps) {
  return (
    <html>
      <head>
        <title>Basic Browser IDE (Deno Subhosting)</title>
        {/* <link rel="stylesheet" href="/styles.css" /> */}
        {/* <script src="/ace/ace.js"></script> */}
        {/* <script src="/app.js"></script> */}
        <link rel="stylesheet" href="/main.css" />
        <script type="module" src="/main.js"></script>
      </head>
      <body>
        <Component {...props} />
      </body>
    </html>
  );
}
