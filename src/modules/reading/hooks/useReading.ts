import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBooks,
  getReadingEntries,
  addReadingEntry,
  deleteLastReadingEntry,
  addBook,
  markBookFinished,
} from "../services/readingService";

export function useBooks(userId: string) {
  return useQuery({
    queryKey: ["books", userId],
    queryFn: () => getBooks(userId),
    enabled: !!userId,
  });
}

export function useReadingEntries(userId: string, bookId: string) {
  return useQuery({
    queryKey: ["reading_entries", userId, bookId],
    queryFn: () => getReadingEntries(userId, bookId),
    enabled: !!userId && !!bookId,
  });
}

export function useAddReadingEntry(userId: string, bookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (currentPage: number) =>
      addReadingEntry(userId, bookId, currentPage),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reading_entries", userId, bookId],
      });
      queryClient.invalidateQueries({ queryKey: ["books", userId] });
    },
  });
}

export function useDeleteLastEntry(userId: string, bookId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: string) => deleteLastReadingEntry(entryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reading_entries", userId, bookId],
      });
    },
  });
}

export function useAddBook(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (book: {
      title: string;
      author: string;
      cover_url: string;
      total_pages: number;
    }) => addBook(userId, book),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books", userId] });
    },
  });
}

export function useMarkFinished(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookId: string) => markBookFinished(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books", userId] });
    },
  });
}
