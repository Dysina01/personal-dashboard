import type { Habit, HabitEntry } from "../types";
import { getMonthDays, getTodayString } from "../utils";

interface Props {
  habits: Habit[];
  entries: HabitEntry[];
  month: string;
}

export function MonthlyCompletion({ habits, entries, month }: Props) {
  const today = getTodayString();
  const allDays = getMonthDays(month);
  const pastDays = allDays.filter((d) => d <= today);

  if (!pastDays.length) return null;

  return (
    <div className="bg-surface-1 rounded-card border border-border shadow-card px-5 py-4">
      {habits.map((habit, i) => {
        const done = entries.filter(
          (e) =>
            e.habit_id === habit.id && e.completed && pastDays.includes(e.date),
        ).length;
        const pct = Math.round((done / pastDays.length) * 100);

        return (
          <div
            key={habit.id}
            className={`flex items-center gap-3 py-2.5 ${
              i < habits.length - 1 ? "border-b border-separator" : ""
            }`}
          >
            <span className="w-16 text-callout font-medium text-text-primary shrink-0">
              {habit.display_name}
            </span>
            <div className="flex-1 h-1.5 rounded-full bg-fill-primary overflow-hidden">
              <div
                className="h-full rounded-full bg-accent transition-all duration-slow"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-9 text-right text-caption font-medium text-text-tertiary shrink-0">
              {pct}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
