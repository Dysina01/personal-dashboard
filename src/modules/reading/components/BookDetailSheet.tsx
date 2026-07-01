"use client";

import { useState } from "react";
import { ProgressBar } from "./ProgressBar";
import {
  useReadingEntries,
  useAddReadingEntry,
  useDeleteLastEntry,
  useMarkFinished,
} from "../hooks/useReading";
import type { Book } from "../types";

interface Props {
  book: Book;
  userId: string;
  onClose: () => void;
}

export function BookDetailSheet({ book, userId, onClose }: Props) {
  const [pageInput, setPageInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  const { data: entries = [], isLoading } = useReadingEntries(userId, book.id);
  const addEntry = useAddReadingEntry(userId, book.id);
  const deleteEntry = useDeleteLastEntry(userId, book.id);
  const markDone = useMarkFinished(userId);

  const latestEntry = entries[0] ?? null;
  const currentPage = latestEntry?.current_page ?? 0;
  const pct = Math.round((currentPage / book.total_pages) * 100);
  const newPage = Number(pageInput);

  // validation
  const isValid =
    pageInput !== "" &&
    newPage > currentPage &&
    newPage <= book.total_pages &&
    newPage !== currentPage;

  function getInputError(): string | null {
    if (pageInput === "") return null;
    if (isNaN(newPage)) return "Enter a valid number.";
    if (newPage <= currentPage)
      return `Must be greater than current page (${currentPage}).`;
    if (newPage > book.total_pages)
      return `Cannot exceed total pages (${book.total_pages}).`;
    return null;
  }

  async function handleSave() {
    const err = getInputError();
    if (err || !isValid) {
      setInputError(err);
      return;
    }
    setInputError(null);

    await addEntry.mutateAsync(newPage);
    setPageInput("");
  }

  async function handleDelete() {
    if (!latestEntry) return;
    await deleteEntry.mutateAsync(latestEntry.id);
  }

  async function handleMarkFinished() {
    await markDone.mutateAsync(book.id);
    onClose();
  }

  const inputClass = `
    h-12 w-full rounded-input border px-4
    text-body text-text-primary placeholder:text-text-muted
    bg-fill-primary
    focus:outline-none focus:border-accent focus:bg-accent-50
    transition-colors duration-fast
    ${inputError ? "border-red-400" : "border-border"}
  `;

  return (
    <div className="flex flex-col pb-8">
      {/* drag handle */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-9 h-1 rounded-full bg-border-strong" />
      </div>

      <div className="px-5">
        {/* book header */}
        <div className="flex gap-3 items-start mb-5">
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
          <div className="flex-1 min-w-0">
            <p className="text-headline font-semibold text-text-primary">
              {book.title}
            </p>
            {book.author && (
              <p className="text-caption text-text-muted mt-0.5">
                {book.author}
              </p>
            )}
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
          </div>
        </div>

        {/* daily update */}
        {book.status === "active" && (
          <div className="mb-5">
            <p className="text-callout font-medium text-text-secondary mb-2">
              Update progress
            </p>
            <div className="flex gap-2">
              <input
                className={inputClass}
                placeholder={`Current page (${currentPage})`}
                type="number"
                inputMode="numeric"
                value={pageInput}
                onChange={(e) => {
                  setPageInput(e.target.value);
                  setInputError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              />
              <button
                onClick={handleSave}
                disabled={!isValid || addEntry.isPending}
                className="h-12 px-5 rounded-btn bg-accent text-white text-callout font-medium shrink-0 disabled:opacity-40 active:scale-[0.97] transition-transform duration-instant"
              >
                {addEntry.isPending ? "…" : "Save"}
              </button>
            </div>
            {inputError && (
              <p
                className="text-caption mt-1.5 px-1"
                style={{ color: "var(--error)" }}
              >
                {inputError}
              </p>
            )}
          </div>
        )}

        {/* history */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-callout font-medium text-text-secondary">
              History
            </p>
            {latestEntry && (
              <button
                onClick={handleDelete}
                disabled={deleteEntry.isPending}
                className="text-caption text-text-muted active:opacity-60 transition-opacity"
              >
                Delete last
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-10 rounded-sm bg-fill-primary animate-pulse"
                />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <p className="text-caption text-text-muted text-center py-6">
              No entries yet
            </p>
          ) : (
            <div className="flex flex-col">
              {entries.map((entry, i) => {
                const prev = entries[i + 1]?.current_page ?? 0;
                const pagesRead = entry.current_page - prev;
                return (
                  <div
                    key={entry.id}
                    className={`flex items-center justify-between py-2.5 ${
                      i < entries.length - 1 ? "border-b border-separator" : ""
                    }`}
                  >
                    <span className="text-callout text-text-secondary">
                      {entry.date}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-caption text-text-muted">
                        p. {entry.current_page}
                      </span>
                      {pagesRead > 0 && (
                        <span className="text-caption font-medium text-accent">
                          +{pagesRead}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* actions */}
        {book.status === "active" && (
          <button
            onClick={handleMarkFinished}
            disabled={markDone.isPending}
            className="w-full h-12 rounded-btn text-body font-medium text-text-tertiary border border-border active:scale-[0.97] transition-transform duration-instant"
          >
            Mark as Finished
          </button>
        )}
      </div>
    </div>
  );
}
