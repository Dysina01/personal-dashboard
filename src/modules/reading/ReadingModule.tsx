"use client";

import { useState } from "react";
import { BookMarked } from "lucide-react";
import { useBooks, useLatestReadingEntries } from "./hooks/useReading";
import { BookCard, BookCardSkeleton } from "./components/BookCard";
import { BookDetailSheet } from "./components/BookDetailSheet";
import { AddBookForm } from "./components/AddBookForm";
import { ModuleContainer } from "@/components/shared/layout/ModuleContainer";
import { Section } from "@/components/shared/layout/Section";
import { EmptyState } from "@/components/shared/feedback/EmptyState";
import { ErrorState } from "@/components/shared/feedback/ErrorState";
import type { Book } from "./types";

interface Props {
  userId: string;
}

export function ReadingModule({ userId }: Props) {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const { data: books = [], isLoading, isError, refetch } = useBooks(userId);
  const { data: latestEntries = {} } = useLatestReadingEntries(userId);

  const activeBooks = books.filter((b) => b.status === "active");
  const finishedBooks = books.filter((b) => b.status !== "active");

  const totalPagesRead = activeBooks.reduce(
    (sum, b) => sum + (latestEntries[b.id]?.current_page ?? 0),
    0,
  );

  return (
    <>
      <ModuleContainer>
        {isLoading ? (
          <Section>
            <div className="flex flex-col gap-3">
              {[1, 2].map((i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          </Section>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : books.length === 0 ? (
          <EmptyState
            title="No books yet"
            description="Start tracking your reading progress."
            action={{ label: "Add Book", onClick: () => setShowAddForm(true) }}
          />
        ) : (
          <>
            <Section>
              <div className="relative overflow-hidden rounded-card border border-border bg-linear-to-br from-violet-500 to-fuchsia-600 p-5 text-white shadow-dialog">
                <div className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                  <BookMarked size={24} />
                </div>
                <p className="text-caption font-medium uppercase tracking-wider text-white/60">
                  Reading now
                </p>
                <p className="mt-3 max-w-56 text-display font-semibold">
                  {activeBooks.length} active{" "}
                  {activeBooks.length === 1 ? "book" : "books"}
                </p>
                <p className="mt-1 text-callout text-white/70">
                  {totalPagesRead.toLocaleString()} pages logged
                </p>
              </div>
            </Section>

            {activeBooks.length > 0 && (
              <Section label="Reading now">
                <div className="flex flex-col gap-3">
                  {activeBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      latestEntry={latestEntries[book.id]}
                      onPress={() => setSelectedBook(book)}
                    />
                  ))}
                </div>
              </Section>
            )}

            {finishedBooks.length > 0 && (
              <Section label="Finished">
                <div className="flex flex-col gap-3">
                  {finishedBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      latestEntry={latestEntries[book.id]}
                      onPress={() => setSelectedBook(book)}
                    />
                  ))}
                </div>
              </Section>
            )}

            <Section>
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full h-12 rounded-btn border border-border text-callout font-medium text-text-tertiary active:scale-[0.97] transition-transform duration-instant"
              >
                + Add Book
              </button>
            </Section>
          </>
        )}
      </ModuleContainer>

      {selectedBook && (
        <BottomSheet onClose={() => setSelectedBook(null)}>
          <BookDetailSheet
            book={selectedBook}
            userId={userId}
            onClose={() => setSelectedBook(null)}
          />
        </BottomSheet>
      )}

      {showAddForm && (
        <BottomSheet onClose={() => setShowAddForm(false)}>
          <AddBookForm userId={userId} onClose={() => setShowAddForm(false)} />
        </BottomSheet>
      )}
    </>
  );
}

function BottomSheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-surface-2 rounded-sheet rounded-b-none border-t border-border shadow-sheet max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
