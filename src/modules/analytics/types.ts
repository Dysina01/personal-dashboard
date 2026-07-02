import type { Habit, HabitEntry } from "@/modules/habits/types";
import type { Book, ReadingEntry } from "@/modules/reading/types";
import type { WorkoutSession } from "@/modules/gym/types";

export interface AnalyticsData {
  habits: Habit[];
  habitEntries: HabitEntry[];
  books: Book[];
  readingEntries: ReadingEntry[];
  workoutSessions: WorkoutSession[];
}

export interface SummaryMetric {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: "blue" | "green" | "amber" | "rose" | "violet" | "slate";
}

export interface BookProgress {
  book: Book;
  currentPage: number;
  percent: number;
}
