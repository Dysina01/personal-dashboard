"use client";

import { useState } from "react";
import { useAddBook } from "../hooks/useReading";

interface Props {
  userId: string;
  onClose: () => void;
}

export function AddBookForm({ userId, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [totalPages, setTotalPages] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addBook = useAddBook(userId);

  const isValid = title.trim() && Number(totalPages) > 0;

  async function handleSave() {
    if (!isValid) return;
    setError(null);

    try {
      await addBook.mutateAsync({
        title: title.trim(),
        author: author.trim(),
        cover_url: coverUrl.trim(),
        total_pages: Number(totalPages),
      });
      onClose();
    } catch {
      setError("Failed to add book. Please try again.");
    }
  }

  const inputClass = `
    h-12 w-full rounded-input border border-border
    bg-fill-primary px-4 text-body text-text-primary
    placeholder:text-text-muted
    focus:outline-none focus:border-accent focus:bg-accent-50
    transition-colors duration-fast
  `;

  return (
    <div className="flex flex-col gap-3 px-5 pb-8 pt-2">
      <h2 className="text-headline font-semibold text-text-primary mb-2">
        Add Book
      </h2>

      <input
        className={inputClass}
        placeholder="Title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder="Cover URL"
        value={coverUrl}
        onChange={(e) => setCoverUrl(e.target.value)}
      />
      <input
        className={inputClass}
        placeholder="Total pages *"
        type="number"
        inputMode="numeric"
        value={totalPages}
        onChange={(e) => setTotalPages(e.target.value)}
      />

      {error && (
        <p
          className="text-caption text-center"
          style={{ color: "var(--error)" }}
        >
          {error}
        </p>
      )}

      <button
        onClick={handleSave}
        disabled={!isValid || addBook.isPending}
        className="h-12 w-full rounded-btn bg-accent text-white text-body font-medium mt-1 disabled:opacity-40 active:scale-[0.97] transition-transform duration-instant"
      >
        {addBook.isPending ? "Adding…" : "Add Book"}
      </button>

      <button
        onClick={onClose}
        className="h-12 w-full rounded-btn text-body font-medium text-text-tertiary active:scale-[0.97] transition-transform duration-instant"
      >
        Cancel
      </button>
    </div>
  );
}
