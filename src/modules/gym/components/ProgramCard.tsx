"use client";

import { Dumbbell, ListPlus } from "lucide-react";
import type { WorkoutProgram, WorkoutSession } from "../types";

interface Props {
  program: WorkoutProgram;
  lastSession?: WorkoutSession;
  onSelect: () => void;
}

export function ProgramCard({ program, lastSession, onSelect }: Props) {
  const exerciseCount = program.exercises?.length ?? 0;

  return (
    <button
      onClick={onSelect}
      className="w-full rounded-card border border-border bg-surface-1 p-5 text-left shadow-card active:scale-[0.98] transition-transform duration-instant"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-accent-50 text-accent">
          <Dumbbell size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-headline font-semibold text-text-primary">
                {program.name}
              </p>
              <p className="mt-0.5 text-caption text-text-tertiary">
                {exerciseCount} exercises
              </p>
            </div>

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fill-primary text-text-tertiary">
              <ListPlus size={18} />
            </div>
          </div>

          {program.exercises && program.exercises.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {program.exercises.slice(0, 5).map((exercise) => (
                <span
                  key={exercise.id}
                  className="rounded-chip bg-fill-primary px-2.5 py-1 text-caption text-text-secondary"
                >
                  {exercise.name}
                </span>
              ))}
            </div>
          )}

          {lastSession && (
            <p className="mt-3 text-caption text-text-muted">
              Last logged {lastSession.date}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

export function ProgramCardSkeleton() {
  return (
    <div className="w-full rounded-card border border-border bg-surface-1 p-5 shadow-card">
      <div className="flex gap-3">
        <div className="h-11 w-11 rounded-sm bg-fill-primary animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-2/3 rounded-full bg-fill-primary animate-pulse" />
          <div className="h-3 w-1/3 rounded-full bg-fill-primary animate-pulse" />
          <div className="mt-4 flex gap-1.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 w-20 rounded-chip bg-fill-primary animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
