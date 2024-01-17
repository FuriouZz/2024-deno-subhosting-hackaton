import { useCallback, useEffect, useState } from "react";
import { ComboBoxResponsive, Entry } from "./ui/combobox-responsive.tsx";
import useAsync from "../hooks/useAsync.ts";
import { getProjects } from "../lib/api.ts";

export default function ProjectList() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const projects = useAsync(useCallback(getProjects, []));

  useEffect(() => {
    if (!projects) return;
    setEntries(
      projects.map((project) => ({ label: project.name, value: project.id })),
    );
  }, [projects]);

  return (
    <ComboBoxResponsive
      placeholder="Select a project…"
      entries={entries}
    />
  );
}
