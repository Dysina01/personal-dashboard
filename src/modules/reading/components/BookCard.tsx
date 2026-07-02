"use client";

import { ProgressBar } from "./ProgressBar";
import { LoadingSkeleton } from "@/components/shared/feedback/LoadingSkeleton";
import type { Book, ReadingEntry } from "../types";

interface Props {
  book: Book;
  latestEntry?: ReadingEntry;
  onPress: () => void;
}

export function BookCard({ book, latestEntry, onPress }: Props) {
  const currentPage = latestEntry?.current_page ?? 0;
  const pct = Math.round((currentPage / book.total_pages) * 100);

  return (
    <button
      onClick={onPress}
      className="w-full overflow-hidden rounded-card border border-border bg-surface-1 text-left shadow-card active:scale-[0.98] transition-transform duration-instant"
    >
      <div className="flex gap-4 p-4">
        <div className="h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-linear-to-br from-accent-200 to-accent-400 flex items-center justify-center shadow-card">
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl">📖</span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-callout font-semibold text-text-primary">
            {book.title}
          </p>
          {book.author && (
            <p className="mt-0.5 truncate text-caption text-text-muted">
              {book.author}
            </p>
          )}

          {book.status === "active" ? (
            <div className="mt-3">
              <ProgressBar value={pct} />
              <div className="mt-1.5 flex justify-between">
                <span className="text-caption text-text-tertiary">
                  p. {currentPage} of {book.total_pages}
                </span>
                <span className="text-caption font-semibold text-accent">
                  {pct}%
                </span>
              </div>
            </div>
          ) : (
            <span className="mt-2 inline-block rounded-chip bg-fill-primary px-2.5 py-1 text-caption font-medium text-text-muted">
              {book.status === "finished" ? "Finished" : "DNF"}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-card border border-border bg-surface-1 p-4">
      <LoadingSkeleton className="h-20 w-14 rounded-lg shrink-0" />
      <div className="flex-1 flex flex-col gap-2 pt-1">
        <LoadingSkeleton className="h-4 w-3/4 rounded-full" />
        <LoadingSkeleton className="h-3 w-1/2 rounded-full" />
        <LoadingSkeleton className="h-1.5 w-full rounded-full mt-2" />
      </div>
    </div>
  );
}
