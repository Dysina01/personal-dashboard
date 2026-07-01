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
      className="w-full bg-surface-1 rounded-card border border-border shadow-card p-5 text-left active:scale-[0.98] transition-transform duration-instant"
    >
      <div className="flex gap-3 items-start">
        {/* cover */}
        <div className="w-12 h-16 rounded-sm overflow-hidden bg-fill-primary shrink-0 flex items-center justify-center">
          {book.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl">📖</span>
          )}
        </div>

        {/* info */}
        <div className="flex-1 min-w-0">
          <p className="text-callout font-semibold text-text-primary truncate">
            {book.title}
          </p>
          {book.author && (
            <p className="text-caption text-text-muted mt-0.5 truncate">
              {book.author}
            </p>
          )}

          {book.status === "active" ? (
            <div className="mt-3">
              <ProgressBar value={pct} />
              <div className="flex justify-between mt-1.5">
                <span className="text-caption text-text-tertiary">
                  p. {currentPage} of {book.total_pages}
                </span>
                <span className="text-caption font-medium text-accent">
                  {pct}%
                </span>
              </div>
            </div>
          ) : (
            <span className="inline-block mt-2 text-caption font-medium px-2 py-0.5 rounded-full bg-fill-primary text-text-muted">
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
    <div className="bg-surface-1 rounded-card border border-border p-5 flex gap-3">
      <LoadingSkeleton className="w-12 h-16 rounded-sm shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <LoadingSkeleton className="h-4 w-3/4 rounded-full" />
        <LoadingSkeleton className="h-3 w-1/2 rounded-full" />
        <LoadingSkeleton className="h-1.5 w-full rounded-full mt-2" />
      </div>
    </div>
  );
}
