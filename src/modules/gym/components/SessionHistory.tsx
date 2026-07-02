"use client";

import { CalendarDays } from "lucide-react";
import type { WorkoutSession } from "../types";

interface Props {
  sessions: WorkoutSession[];
}

export function SessionHistory({ sessions }: Props) {
  if (sessions.length === 0) {
    return (
      <div className="rounded-card border border-border bg-surface-1 px-5 py-10 text-center shadow-card">
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
        const totalVolume = sets.reduce(
          (sum, set) => sum + set.weight_kg * set.reps,
          0,
        );

        return (
          <div
            key={session.id}
            className="rounded-card border border-border bg-surface-1 p-4 shadow-card"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate text-callout font-semibold text-text-primary">
                  {session.workout_programs?.name ?? "Workout"}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-caption text-text-muted">
                  <CalendarDays size={13} />
                  <span>{session.date}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-headline font-semibold text-accent">
                  {sets.length}
                </p>
                <p className="text-caption text-text-muted">sets</p>
              </div>
            </div>

            {sets.length > 0 && (
              <div className="mt-3 flex flex-col gap-1.5 border-t border-separator pt-3">
                {sets.slice(0, 3).map((set) => (
                  <div
                    key={set.id}
                    className="flex items-center justify-between gap-3 text-caption"
                  >
                    <span className="truncate text-text-secondary">
                      {set.exercises?.name ?? "Exercise"}
                    </span>
                    <span className="shrink-0 font-medium text-text-primary">
                      {set.weight_kg}kg × {set.reps}
                    </span>
                  </div>
                ))}
                {sets.length > 3 && (
                  <span className="text-caption text-text-muted">
                    +{sets.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="mt-3 flex items-center justify-between border-t border-separator pt-3">
              <span className="text-caption text-text-muted">Volume</span>
              <span className="text-caption font-semibold text-text-secondary">
                {Math.round(totalVolume).toLocaleString()} kg
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
