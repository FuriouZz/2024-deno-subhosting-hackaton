import * as React from "react";
import { ComboBoxResponsive, Entry } from "./ui/combobox-responsive.tsx";
import useAsync from "@/hooks/useAsync.ts";
import { getDeployments, IDeployment, IProject } from "@/lib/api.ts";
import { useSignals } from "@preact/signals-react/runtime";

export default function DeploymentList(
  { project, onChange }: { project?: string; onChange: () => void },
) {
  useSignals();

  const [entries, setEntries] = React.useState<Entry[]>();
  const deployments = useAsync<IDeployment[] | null>(React.useCallback(() => {
    if (!project) return null;
    return getDeployments(project);
  }, [project]));

  React.useEffect(() => {
    if (!deployments) return;
    const values = deployments.filter((d) => {
      return Array.isArray(d.domains) && d.domains.length > 0;
    }).map((d) => ({
      label: d.id,
      value: `https://${d.domains![0]}`,
    }));

    setEntries(values);
  }, [deployments]);

  if (!entries) return null;

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Deployments:</p>
      <ComboBoxResponsive
        searchText="Filter deployments…"
        placeholder="Select a deployment…"
        entries={entries}
        onChange={onChange}
      />
    </div>
  );
}
