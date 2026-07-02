"use client";

import { BookOpen } from "lucide-react";
import type { BookProgress } from "../types";

interface Props {
  progress: BookProgress | null;
}

export function CurrentBookCard({ progress }: Props) {
  if (!progress) {
    return (
      <div className="rounded-card border border-border bg-surface-1 p-5 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-fill-primary text-text-tertiary">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-callout font-semibold text-text-primary">
              No active book
            </p>
            <p className="text-caption text-text-muted">
              Add one from Reading.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-card border border-border bg-surface-1 shadow-card">
      <div className="bg-linear-to-r from-accent-500 to-cyan-400 px-5 py-4 text-white">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-caption font-medium uppercase tracking-wider text-white/70">
              Current book
            </p>
            <p className="mt-1 truncate text-headline font-semibold">
              {progress.book.title}
            </p>
          </div>
          <BookOpen className="shrink-0 text-white/80" size={24} />
        </div>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between text-caption">
          <span className="text-text-muted">
            p. {progress.currentPage} of {progress.book.total_pages}
          </span>
          <span className="font-semibold text-accent">{progress.percent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-fill-primary">
          <div
            className="h-full rounded-full bg-accent transition-all duration-slow"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
