"use client";

import { useState } from "react";
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

  function handleToggle(habitId: string, date: string, completed: boolean) {
    toggle.mutate({ habitId, date, completed });
  }

  return (
    <ModuleContainer>
      <Section>
        {/* week navigation */}
        <div className="flex items-center justify-between mb-1 px-1">
          <div>
            <p className="text-headline font-semibold text-text-primary">
              {weekOffset === 0
                ? "This week"
                : weekOffset === -1
                  ? "Last week"
                  : `${Math.abs(weekOffset)} weeks ago`}
            </p>
            <p className="text-caption text-text-muted mt-0.5">
              {weekDays[0]} — {weekDays[6]}
            </p>
          </div>
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

        <HabitGrid
          habits={habits}
          entries={entries}
          weekDays={weekDays}
          loading={loading}
          onToggle={handleToggle}
        />
      </Section>

      <Section label="Monthly completion">
        <MonthlyCompletion habits={habits} entries={entries} month={month} />
      </Section>
    </ModuleContainer>
  );
}
