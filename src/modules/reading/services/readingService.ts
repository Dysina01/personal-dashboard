import { createClient } from "@/lib/supabase/client";
import type { Book, ReadingEntry } from "../types";

const supabase = createClient();

export async function getBooks(userId: string): Promise<Book[]> {
  const { data, error } = await supabase
    .from("books")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getReadingEntries(
  userId: string,
  bookId: string,
): Promise<ReadingEntry[]> {
  const { data, error } = await supabase
    .from("reading_entries")
    .select("*")
    .eq("user_id", userId)
    .eq("book_id", bookId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getAllReadingEntries(
  userId: string,
  month: string,
): Promise<ReadingEntry[]> {
  const [year, m] = month.split("-");
  const from = `${year}-${m}-01`;
  const to = new Date(Number(year), Number(m), 0).toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("reading_entries")
    .select("*")
    .eq("user_id", userId)
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}

export async function addReadingEntry(
  userId: string,
  bookId: string,
  currentPage: number,
): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);

  const { error } = await supabase.from("reading_entries").upsert(
    {
      user_id: userId,
      book_id: bookId,
      date: today,
      current_page: currentPage,
    },
    { onConflict: "book_id,date" },
  );

  if (error) throw error;
}

export async function deleteLastReadingEntry(entryId: string): Promise<void> {
  const { error } = await supabase
    .from("reading_entries")
    .delete()
    .eq("id", entryId);

  if (error) throw error;
}

export async function addBook(
  userId: string,
  book: {
    title: string;
    author: string;
    cover_url: string;
    total_pages: number;
  },
): Promise<Book> {
  const { data, error } = await supabase
    .from("books")
    .insert({
      user_id: userId,
      title: book.title,
      author: book.author || null,
      cover_url: book.cover_url || null,
      total_pages: book.total_pages,
      status: "active",
      started_at: new Date().toISOString().slice(0, 10),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markBookFinished(bookId: string): Promise<void> {
  const { error } = await supabase
    .from("books")
    .update({
      status: "finished",
      finished_at: new Date().toISOString().slice(0, 10),
    })
    .eq("id", bookId);

  if (error) throw error;
}
