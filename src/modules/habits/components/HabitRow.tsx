"use client";

import { DayCell } from "./DayCell";
import { DAY_LABELS } from "../utils";
import type { Habit } from "../types";

interface Props {
  habit: Habit;
  weekDays: string[];
  today: string;
  entries: Record<string, boolean>;
  onToggle: (habitId: string, date: string, completed: boolean) => void;
  streak: number;
}

export function HabitRow({
  habit,
  weekDays,
  today,
  entries,
  onToggle,
  streak,
}: Props) {
  return (
    <div className="flex items-center gap-0 py-2.5 border-t border-separator">
      {/* name */}
      <span className="w-16 text-callout font-medium text-text-secondary shrink-0">
        {habit.display_name}
      </span>

      {/* day cells */}
      <div className="flex flex-1 gap-1">
        {weekDays.map((date) => {
          const completed = entries[date] ?? false;
          const isToday = date === today;
          const isFuture = date > today;

          return (
            <DayCell
              key={date}
              completed={completed}
              isToday={isToday}
              isFuture={isFuture}
              onToggle={() => onToggle(habit.id, date, !completed)}
            />
          );
        })}
      </div>

      {/* streak */}
      <span className="w-7 text-right text-caption font-medium text-text-muted shrink-0">
        {streak > 0 ? streak : ""}
      </span>
    </div>
  );
}
