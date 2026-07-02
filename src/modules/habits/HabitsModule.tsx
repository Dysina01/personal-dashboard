"use client";

import { useState } from "react";
import { Flame } from "lucide-react";
import { useHabits, useHabitEntries, useToggleHabit } from "./hooks/useHabits";
import { HabitGrid } from "./components/HabitGrid";
import { MonthlyCompletion } from "./components/MonthlyCompletion";
import { ModuleContainer } from "@/components/shared/layout/ModuleContainer";
import { Section } from "@/components/shared/layout/Section";
import { getWeekDays } from "./utils";

interface Props {
  userId: string;
  month: string;
}

export function HabitsModule({ userId, month }: Props) {
  const [weekOffset, setWeekOffset] = useState(0);
  const weekDays = getWeekDays(weekOffset);

  const { data: habits = [], isLoading: loadingHabits } = useHabits();
  const { data: entries = [], isLoading: loadingEntries } = useHabitEntries(
    userId,
    month,
  );
  const toggle = useToggleHabit(userId, month);

  const loading = loadingHabits || loadingEntries;
  const todayCompleted = entries.filter(
    (e) => e.completed && weekDays.includes(e.date),
  ).length;

  function handleToggle(habitId: string, date: string, completed: boolean) {
    toggle.mutate({ habitId, date, completed });
  }

  return (
    <ModuleContainer>
      <Section>
        <div className="relative overflow-hidden rounded-card border border-border bg-linear-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-dialog">
          <div className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <Flame size={24} />
          </div>
          <p className="text-caption font-medium uppercase tracking-wider text-white/60">
            This week
          </p>
          <p className="mt-3 max-w-56 text-display font-semibold">
            {todayCompleted} habits checked off
          </p>
          <p className="mt-1 text-callout text-white/70">
            {weekDays[0]} — {weekDays[6]}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between px-1">
          <p className="text-headline font-semibold text-text-primary">
            {weekOffset === 0
              ? "This week"
              : weekOffset === -1
                ? "Last week"
                : `${Math.abs(weekOffset)} weeks ago`}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setWeekOffset((w) => w - 1)}
              className="w-8 h-8 rounded-full bg-fill-primary flex items-center justify-center text-text-tertiary active:scale-90 transition-transform duration-instant"
            >
              ‹
            </button>
            <button
              onClick={() => setWeekOffset((w) => Math.min(0, w + 1))}
              disabled={weekOffset >= 0}
              className="w-8 h-8 rounded-full bg-fill-primary flex items-center justify-center text-text-tertiary disabled:opacity-30 active:scale-90 transition-transform duration-instant"
            >
              ›
            </button>
          </div>
        </div>

        <div className="mt-3">
          <HabitGrid
            habits={habits}
            entries={entries}
            weekDays={weekDays}
            loading={loading}
            onToggle={handleToggle}
          />
        </div>
      </Section>

      <Section label="Monthly completion">
        <MonthlyCompletion habits={habits} entries={entries} month={month} />
      </Section>
    </ModuleContainer>
  );
}
