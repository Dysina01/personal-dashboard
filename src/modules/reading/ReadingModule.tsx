"use client";

import { useState } from "react";
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

      {/* Book Detail — Bottom Sheet */}
      {selectedBook && (
        <BottomSheet onClose={() => setSelectedBook(null)}>
          <BookDetailSheet
            book={selectedBook}
            userId={userId}
            onClose={() => setSelectedBook(null)}
          />
        </BottomSheet>
      )}

      {/* Add Book — Bottom Sheet */}
      {showAddForm && (
        <BottomSheet onClose={() => setShowAddForm(false)}>
          <AddBookForm userId={userId} onClose={() => setShowAddForm(false)} />
        </BottomSheet>
      )}
    </>
  );
}

// Bottom Sheet — ساده و reusable
function BottomSheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* sheet */}
      <div className="relative bg-surface-2 rounded-sheet rounded-b-none border-t border-border shadow-sheet max-h-[90vh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
