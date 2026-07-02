"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SummaryMetric } from "../types";

const toneStyles: Record<SummaryMetric["tone"], string> = {
  blue: "from-blue-500/16 to-cyan-400/8 text-blue-600",
  green: "from-emerald-500/16 to-lime-400/8 text-emerald-600",
  amber: "from-amber-500/18 to-orange-400/8 text-amber-600",
  rose: "from-rose-500/16 to-pink-400/8 text-rose-600",
  violet: "from-violet-500/16 to-fuchsia-400/8 text-violet-600",
  slate: "from-slate-500/12 to-zinc-400/8 text-text-tertiary",
};

interface Props {
  metric: SummaryMetric;
  icon: LucideIcon;
}

export function SummaryCard({ metric, icon: Icon }: Props) {
  return (
    <div className="relative min-h-32 overflow-hidden rounded-card border border-border bg-surface-1 p-4 shadow-card">
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-br",
          toneStyles[metric.tone],
        )}
      />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <p className="text-caption font-medium uppercase tracking-wider text-text-muted">
            {metric.label}
          </p>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-current shadow-card dark:bg-white/10">
            <Icon size={16} />
          </div>
        </div>

        <div>
          <p className="text-display font-semibold text-text-primary">
            {metric.value}
          </p>
          <p className="mt-1 text-caption text-text-tertiary">
            {metric.detail}
          </p>
        </div>
      </div>
    </div>
  );
}
