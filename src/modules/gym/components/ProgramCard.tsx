"use client";

import { Dumbbell, ChevronRight } from "lucide-react";
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
      className="w-full rounded-card border border-border bg-surface-1 p-4 text-left shadow-card active:scale-[0.98] transition-transform duration-instant"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-rose-500 text-white shadow-card">
          <Dumbbell size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-callout font-semibold text-text-primary">
            {program.name}
          </p>
          <p className="mt-0.5 text-caption text-text-tertiary">
            {exerciseCount} exercises
            {lastSession && ` · last ${lastSession.date}`}
          </p>
        </div>

        <ChevronRight size={18} className="shrink-0 text-text-muted" />
      </div>
    </button>
  );
}

export function ProgramCardSkeleton() {
  return (
    <div className="w-full rounded-card border border-border bg-surface-1 p-4 shadow-card">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-fill-primary animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded-full bg-fill-primary animate-pulse" />
          <div className="h-3 w-1/3 rounded-full bg-fill-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
}
