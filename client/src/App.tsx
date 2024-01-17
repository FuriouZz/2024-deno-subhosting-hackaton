import { lazy } from "react";
import ProjectList from "./components/ProjectList.tsx";
import {
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable.tsx";

const Editor = lazy(() => import("./components/Editor/Editor.tsx"));

export default function App() {
  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-screen">
      <ResizablePanel>
        {import.meta.env.SSR ? undefined : <Editor />}
      </ResizablePanel>
      <ResizablePanel>
        <ResizablePanel>
          <ProjectList />
        </ResizablePanel>
        <ResizablePanel>Preview</ResizablePanel>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
