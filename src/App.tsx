import * as React from "react";
import { useSignals } from "@preact/signals-react/runtime";
import ProjectList from "@/components/ProjectList.tsx";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable.tsx";
import DeploymentList from "@/components/DeploymentList.tsx";
import { Entry } from "@/components/ui/combobox-responsive.tsx";
import { IDeployment } from "@/lib/api.ts";

const Editor = React.lazy(() => import("@/components/Editor.tsx"));

export default function App() {
  const [projectId, setProjectId] = React.useState<string>();
  const [deploymentURL, setDeploymentURL] = React.useState<string>();

  const onProjectChange = React.useCallback((entry: Entry) => {
    globalThis.history.pushState({}, "", "/projects/" + entry.value);
    setProjectId(entry.value);
  }, []);

  const onDeploymentChange = React.useCallback((entry: Entry) => {
    setDeploymentURL(entry.value);
  }, []);

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      <ResizablePanel>
        {import.meta.env.SSR ? undefined : <Editor />}
      </ResizablePanel>
      <ResizablePanel>
        <ResizablePanel>
          <div className="flex">
            <ProjectList onChange={onProjectChange} />
            <DeploymentList project={projectId} onChange={onDeploymentChange} />
          </div>
        </ResizablePanel>
        <ResizablePanel className="h-full">
          {deploymentURL && (
            <iframe src={deploymentURL} className="h-full w-full" />
          )}
        </ResizablePanel>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
