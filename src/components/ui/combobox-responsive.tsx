"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";

export interface Entry {
  value: string;
  label: string;
}

export function ComboBoxResponsive(
  {
    placeholder = "Select an entry…",
    defaultValue = null,
    onChange,
    searchText,
    entries,
  }: {
    placeholder?: string;
    searchText?: string;
    onChange?: (entry: Entry) => void;
    defaultValue?: string | null;
    entries: Entry[];
  },
) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedEntry, setSelectedEntry] = React.useState<Entry | null>(
    null,
  );

  React.useEffect(() => {
    setSelectedEntry(entries.find((entry) => entry.value === defaultValue));
  }, [entries, defaultValue]);

  React.useEffect(() => {
    if (selectedEntry && onChange) onChange(selectedEntry);
  }, [selectedEntry, onChange]);

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-start">
            {selectedEntry ? <>{selectedEntry.label}</> : <>{placeholder}</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <EntryList
            searchText={searchText}
            entries={entries}
            setOpen={setOpen}
            setSelectedEntry={setSelectedEntry}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" className="w-[150px] justify-start">
          {selectedEntry ? <>{selectedEntry.label}</> : <>{placeholder}</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <EntryList
            searchText={searchText}
            entries={entries}
            setOpen={setOpen}
            setSelectedEntry={setSelectedEntry}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function EntryList({
  entries,
  searchText = "Filter entries...",
  setOpen,
  setSelectedEntry,
}: {
  entries: Entry[];
  searchText?: string;
  setOpen: (open: boolean) => void;
  setSelectedEntry: (entry: Entry | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder={searchText} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {entries.map((entry) => (
            <CommandItem
              key={entry.value}
              value={entry.value}
              onSelect={(value: unknown) => {
                setSelectedEntry(
                  entries.find((entry) => entry.value === value) || null,
                );
                setOpen(false);
              }}
            >
              {entry.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
