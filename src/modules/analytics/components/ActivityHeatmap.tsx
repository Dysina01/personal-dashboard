"use client";

import { cn } from "@/lib/utils";

interface Props {
  days: Array<{ date: string; count: number }>;
}

function getTone(count: number) {
  if (count >= 5) return "bg-accent";
  if (count >= 3) return "bg-accent-400";
  if (count >= 1) return "bg-accent-200";
  return "bg-fill-primary";
}

export function ActivityHeatmap({ days }: Props) {
  return (
    <div className="rounded-card border border-border bg-surface-1 p-5 shadow-card">
      <div className="mb-4">
        <p className="text-headline font-semibold text-text-primary">
          Month map
        </p>
        <p className="text-caption text-text-muted">
          Daily habit intensity
        </p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => (
          <div
            key={day.date}
            className={cn(
              "aspect-square rounded-sm border border-border-subtle",
              getTone(day.count),
            )}
            title={`${day.date}: ${day.count}`}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-caption text-text-muted">
        <span>Less</span>
        <div className="flex gap-1.5">
          {[0, 1, 3, 5].map((count) => (
            <span
              key={count}
              className={cn("h-3 w-3 rounded-xs", getTone(count))}
            />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
