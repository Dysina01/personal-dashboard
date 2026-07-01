"use client";

import { HabitRow } from "./HabitRow";
import { DAY_LABELS, getTodayString } from "../utils";
import { LoadingSkeleton } from "@/components/shared/feedback/LoadingSkeleton";
import type { Habit, HabitEntry } from "../types";

interface Props {
  habits: Habit[];
  entries: HabitEntry[];
  weekDays: string[];
  loading: boolean;
  onToggle: (habitId: string, date: string, completed: boolean) => void;
}

function calcStreak(
  habitId: string,
  entries: HabitEntry[],
  today: string,
): number {
  const completed = entries
    .filter((e) => e.habit_id === habitId && e.completed)
    .map((e) => e.date)
    .sort()
    .reverse();

  if (!completed.length) return 0;

  let streak = 0;
  let current = today;

  for (const date of completed) {
    if (date === current) {
      streak++;
      const d = new Date(current);
      d.setDate(d.getDate() - 1);
      current = d.toISOString().slice(0, 10);
    } else if (date < current) {
      break;
    }
  }

  return streak;
}

export function HabitGrid({
  habits,
  entries,
  weekDays,
  loading,
  onToggle,
}: Props) {
  const today = getTodayString();

  if (loading) {
    return (
      <div className="bg-surface-1 rounded-card border border-border shadow-card p-5 flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <LoadingSkeleton key={i} className="h-9 w-full rounded-sm" />
        ))}
      </div>
    );
  }

  // entries → lookup map: habitId+date → completed
  const entryMap: Record<string, Record<string, boolean>> = {};
  for (const e of entries) {
    if (!entryMap[e.habit_id]) entryMap[e.habit_id] = {};
    entryMap[e.habit_id][e.date] = e.completed;
  }

  return (
    <div className="bg-surface-1 rounded-card border border-border shadow-card px-5 pt-3 pb-2">
      {/* day labels */}
      <div className="flex items-center">
        <div className="w-16 shrink-0" />
        <div className="flex flex-1 gap-1">
          {DAY_LABELS.map((label, i) => {
            const isToday = weekDays[i] === today;
            return (
              <span
                key={i}
                className={`flex-1 text-center text-caption font-medium
                  ${isToday ? "text-accent" : "text-text-muted"}`}
              >
                {label}
              </span>
            );
          })}
        </div>
        <div className="w-7 shrink-0" />
      </div>

      {/* rows */}
      {habits.map((habit) => (
        <HabitRow
          key={habit.id}
          habit={habit}
          weekDays={weekDays}
          today={today}
          entries={entryMap[habit.id] ?? {}}
          streak={calcStreak(habit.id, entries, today)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
