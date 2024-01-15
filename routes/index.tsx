interface IIndexProps {
  // deno-lint-ignore no-explicit-any
  Component?: any;
  projects?: { id: string; name: string }[];
}

export default function Index({ projects }: IIndexProps) {
  const projList = projects?.map((p) => {
    return <option value={p.id}>{p.name}</option>;
  });

  return (
    <>
      <nav>
        <h1>
          Basic Browser IDE
        </h1>
        <div id="project-selector">
          <select id="project-list">
            {projList}
          </select>
          <form action="/project" method="POST">
            <button type="submit" id="new-project">
              Generate New Project
            </button>
          </form>
        </div>
      </nav>

      <main>
        <div style="position:relative;height:100%;width:100%;">
          <div id="editor-container">
            <div id="editor"></div>
          </div>
          <div id="deployments-container">
            <h3>Deployments</h3>
            <div id="deployments"></div>
          </div>
          <button id="deploy-button">Save & Deploy</button>
        </div>
      </main>
    </>
  );
}
