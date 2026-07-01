export interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string | null;
  cover_url: string | null;
  total_pages: number;
  status: string;
  started_at: string;
  finished_at: string | null;
  created_at: string;
}

export interface ReadingEntry {
  id: string;
  book_id: string;
  user_id: string;
  date: string;
  current_page: number;
  created_at: string;
}

export interface BookWithProgress extends Book {
  current_page: number; // از آخرین entry
  pages_read: number; // این ماه
}
