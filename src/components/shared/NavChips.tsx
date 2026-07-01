"use client";

import { cn } from "@/lib/utils";
import { type Tab } from "@/types";
import { useRef } from "react";

interface Props {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function NavChips({ tabs, activeTab, onChange }: Props) {
  return (
    <div className="overflow-x-auto scrollbar-none px-5 pb-2.5">
      <div className="flex gap-1.5 w-max">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "h-8 px-4 rounded-chip text-callout font-medium whitespace-nowrap border transition-all duration-fast active:scale-[0.96]",
                isActive
                  ? "bg-text-primary text-surface-0 border-transparent"
                  : "bg-transparent text-text-tertiary border-border-strong",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
