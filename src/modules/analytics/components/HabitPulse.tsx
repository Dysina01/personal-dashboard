"use client";

import type { Habit, HabitEntry } from "@/modules/habits/types";

interface Props {
  habits: Habit[];
  entries: HabitEntry[];
}

export function HabitPulse({ habits, entries }: Props) {
  const completedByHabit = new Map<string, number>();
  for (const entry of entries) {
    if (!entry.completed) continue;
    completedByHabit.set(
      entry.habit_id,
      (completedByHabit.get(entry.habit_id) ?? 0) + 1,
    );
  }

  const max = Math.max(1, ...Array.from(completedByHabit.values()));

  return (
    <div className="rounded-card border border-border bg-surface-1 p-5 shadow-card">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-headline font-semibold text-text-primary">
            Habit pulse
          </p>
          <p className="text-caption text-text-muted">
            Completion balance this month
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {habits.map((habit) => {
          const count = completedByHabit.get(habit.id) ?? 0;
          const width = Math.max(7, Math.round((count / max) * 100));

          return (
            <div key={habit.id} className="grid grid-cols-[72px_1fr_32px] items-center gap-3">
              <span className="truncate text-caption font-medium text-text-secondary">
                {habit.display_name}
              </span>
              <div className="h-2 overflow-hidden rounded-full bg-fill-primary">
                <div
                  className="h-full rounded-full bg-text-primary"
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className="text-right text-caption font-semibold text-text-primary">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
