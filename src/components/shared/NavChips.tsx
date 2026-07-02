"use client";

import { cn } from "@/lib/utils";
import { type Tab } from "@/types";

interface Props {
  tabs: Tab[];
  activeTab: string;
  onChange: (id: string) => void;
}

export function NavChips({ tabs, activeTab, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 px-5 pb-4 pt-1">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex items-center gap-3 rounded-card border p-3.5 text-left transition-all duration-fast active:scale-[0.97]",
              isActive
                ? "border-accent/30 bg-accent-50 shadow-card"
                : "border-border bg-surface-1 shadow-card",
            )}
          >
            {/* 👇 جای آیکون — کامپوننت آیکون خودتو اینجا جایگزین کن */}
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                isActive
                  ? "bg-accent text-white"
                  : "bg-fill-primary text-text-tertiary",
              )}
            >
              {tab.icon ?? (
                <span className="text-callout font-semibold">
                  {tab.label.charAt(0)}
                </span>
              )}
            </div>

            <span
              className={cn(
                "text-callout font-medium",
                isActive ? "text-text-primary" : "text-text-secondary",
              )}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
