"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface Entry {
  value: string;
  label: string;
}

export function ComboBoxResponsive(
  { placeholder = "Select an entry…", defaultSelected = null, entries }: {
    placeholder?: string;
    defaultSelected?: Entry | null;
    entries: Entry[];
  },
) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedStatus, setSelectedEntry] = React.useState<Entry | null>(
    () => defaultSelected,
  );

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedStatus ? <>{selectedStatus.label}</> : <>{placeholder}</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <EntryList
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
          {selectedStatus ? <>{selectedStatus.label}</> : <>{placeholder}</>}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mt-4 border-t">
          <EntryList
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
  setOpen,
  setSelectedEntry,
}: {
  entries: Entry[];
  setOpen: (open: boolean) => void;
  setSelectedEntry: (entry: Entry | null) => void;
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter status..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {entries.map((entry) => (
            <CommandItem
              key={entry.value}
              value={entry.value}
              onSelect={(value) => {
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
