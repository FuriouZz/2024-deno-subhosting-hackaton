import * as React from "react";
import {
  ComboBoxResponsive,
  Entry,
} from "@/components/ui/combobox-responsive.tsx";
import useAsync from "@/hooks/useAsync.ts";
import { getProjects, IProject } from "@/lib/api.ts";

const location = new URL(window.location.href);
const pattern = /^\/projects\/(.+)/;
const [_, projectId] = location.pathname.match(pattern) ?? [];

export default function ProjectList({ onChange }: { onChange: () => void }) {
  const [entries, setEntries] = React.useState<Entry[]>();
  const projects = useAsync<IProject[]>(React.useCallback(getProjects, []));

  React.useEffect(() => {
    if (!projects) return;
    setEntries(
      projects.map((project) => ({ label: project.name, value: project.id })),
    );
  }, [projects]);

  if (!entries) return null;

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Project:</p>
      <ComboBoxResponsive
        searchText="Filter projects…"
        placeholder="Select a project…"
        entries={entries}
        defaultValue={projectId}
        onChange={onChange}
      />
    </div>
  );
}
