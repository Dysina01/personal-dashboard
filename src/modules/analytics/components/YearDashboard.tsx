"use client";

import { getYearMonths } from "../utils";
import type { HabitEntry } from "@/modules/habits/types";

interface Props {
  selectedMonth: string;
  entries: HabitEntry[];
}

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function YearDashboard({ selectedMonth, entries }: Props) {
  const months = getYearMonths(selectedMonth);
  const countByMonth = new Map<string, number>();

  for (const entry of entries) {
    if (!entry.completed) continue;
    const month = entry.date.slice(0, 7);
    countByMonth.set(month, (countByMonth.get(month) ?? 0) + 1);
  }

  const currentMonthCount = countByMonth.get(selectedMonth) ?? 0;

  return (
    <div className="rounded-card border border-border bg-surface-1 p-5 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-headline font-semibold text-text-primary">
            Year dashboard
          </p>
          <p className="text-caption text-text-muted">
            Selected month has {currentMonthCount} wins
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {months.map((month, index) => {
          const isSelected = month === selectedMonth;
          const count = countByMonth.get(month) ?? 0;

          return (
            <div
              key={month}
              className={`rounded-sm border px-3 py-3 ${
                isSelected
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-fill-secondary"
              }`}
            >
              <p
                className={`text-caption font-medium ${
                  isSelected ? "text-white/75" : "text-text-muted"
                }`}
              >
                {labels[index]}
              </p>
              <p className="mt-1 text-headline font-semibold">{count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
