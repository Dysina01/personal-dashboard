"use client";

import { CalendarDays } from "lucide-react";
import type { WorkoutSession } from "../types";

interface Props {
  sessions: WorkoutSession[];
}

export function SessionHistory({ sessions }: Props) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-card border border-border bg-surface-1 px-5 py-8 text-center">
        <p className="text-callout font-medium text-text-secondary">
          No workouts logged this month
        </p>
        <p className="mt-1 text-caption text-text-muted">
          Pick a program above when you train.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {sessions.map((session) => {
        const sets = session.exercise_sets ?? [];
        const totalSets = sets.length;
        const totalVolume = sets.reduce(
          (sum, set) => sum + set.weight_kg * set.reps,
          0,
        );

        return (
          <div
            key={session.id}
            className="rounded-card border border-border bg-surface-1 p-5 shadow-card"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-callout font-semibold text-text-primary">
                  {session.workout_programs?.name ?? "Workout"}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-caption text-text-muted">
                  <CalendarDays size={13} />
                  <span>{session.date}</span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-callout font-semibold text-accent">
                  {totalSets}
                </p>
                <p className="text-caption text-text-muted">sets</p>
              </div>
            </div>

            {sets.length > 0 && (
              <div className="mt-4 flex flex-col gap-2">
                {sets.slice(0, 4).map((set) => (
                  <div
                    key={set.id}
                    className="flex items-center justify-between gap-3 text-caption"
                  >
                    <span className="truncate text-text-secondary">
                      {set.exercises?.name ?? "Exercise"}
                    </span>
                    <span className="shrink-0 font-medium text-text-primary">
                      {set.weight_kg}kg x {set.reps}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex items-center justify-between border-t border-separator pt-3">
              <span className="text-caption text-text-muted">Volume</span>
              <span className="text-caption font-medium text-text-secondary">
                {Math.round(totalVolume).toLocaleString()} kg
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
