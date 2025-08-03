"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import DynamicIcon, { getAvailableIcons } from "./DynamicIcon";

interface IconSelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export default function IconSelector({ 
  value, 
  onValueChange, 
  placeholder = "Select an icon..." 
}: IconSelectorProps) {
  const [open, setOpen] = useState(false);
  const availableIcons = getAvailableIcons();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value ? (
            <div className="flex items-center gap-2">
              <DynamicIcon name={value} size={16} />
              <span>{availableIcons.find(icon => icon.value === value)?.label}</span>
            </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search icons..." />
          <CommandEmpty>No icon found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {availableIcons.map((icon) => (
              <CommandItem
                key={icon.value}
                onSelect={() => {
                  onValueChange(icon.value);
                  setOpen(false);
                }}
              >
                <div className="flex items-center gap-2 flex-1">
                  <DynamicIcon name={icon.value} size={16} />
                  <span>{icon.label}</span>
                </div>
                <Check
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === icon.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}