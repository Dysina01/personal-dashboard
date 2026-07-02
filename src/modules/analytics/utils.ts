import { getMonthDays } from "@/modules/habits/utils";
import type { Habit, HabitEntry } from "@/modules/habits/types";
import type { Book, ReadingEntry } from "@/modules/reading/types";
import type { WorkoutSession } from "@/modules/gym/types";
import type { BookProgress, SummaryMetric } from "./types";

export function getCompletedEntries(entries: HabitEntry[]) {
  return entries.filter((entry) => entry.completed);
}

export function getHabitCompletionRate(
  habits: Habit[],
  entries: HabitEntry[],
  month: string,
) {
  const totalPossible = habits.length * getMonthDays(month).length;
  if (totalPossible === 0) return 0;

  return Math.round((getCompletedEntries(entries).length / totalPossible) * 100);
}

export function getHabitDays(entries: HabitEntry[], habitName: string) {
  return new Set(
    entries
      .filter((entry) => entry.completed && entry.habit_id === habitName)
      .map((entry) => entry.date),
  ).size;
}

export function getBestHabitStreak(entries: HabitEntry[], month: string) {
  const days = getMonthDays(month);
  const completedByHabit = new Map<string, Set<string>>();

  for (const entry of entries) {
    if (!entry.completed) continue;
    const dates = completedByHabit.get(entry.habit_id) ?? new Set<string>();
    dates.add(entry.date);
    completedByHabit.set(entry.habit_id, dates);
  }

  let best = 0;
  for (const dates of completedByHabit.values()) {
    let current = 0;
    for (const day of days) {
      if (dates.has(day)) {
        current += 1;
        best = Math.max(best, current);
      } else {
        current = 0;
      }
    }
  }

  return best;
}

export function getReadingStats(entries: ReadingEntry[]) {
  const byBook = new Map<string, ReadingEntry[]>();

  for (const entry of entries) {
    byBook.set(entry.book_id, [...(byBook.get(entry.book_id) ?? []), entry]);
  }

  let pagesRead = 0;
  const readingDays = new Set<string>();

  for (const bookEntries of byBook.values()) {
    const sorted = [...bookEntries].sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    sorted.forEach((entry, index) => {
      const previous = sorted[index - 1]?.current_page ?? 0;
      pagesRead += Math.max(0, entry.current_page - previous);
      readingDays.add(entry.date);
    });
  }

  return {
    pagesRead,
    readingDays: readingDays.size,
  };
}

export function getCurrentBookProgress(
  books: Book[],
  entries: ReadingEntry[],
): BookProgress | null {
  const activeBooks = books.filter((book) => book.status === "active");
  if (activeBooks.length === 0) return null;

  const latestByBook = new Map<string, ReadingEntry>();
  for (const entry of entries) {
    const current = latestByBook.get(entry.book_id);
    if (!current || entry.date > current.date) {
      latestByBook.set(entry.book_id, entry);
    }
  }

  const book =
    activeBooks.find((item) => latestByBook.has(item.id)) ?? activeBooks[0];
  const currentPage = latestByBook.get(book.id)?.current_page ?? 0;
  const percent = Math.min(
    100,
    Math.round((currentPage / book.total_pages) * 100),
  );

  return { book, currentPage, percent };
}

export function buildSummaryMetrics(params: {
  habits: Habit[];
  habitEntries: HabitEntry[];
  readingEntries: ReadingEntry[];
  workoutSessions: WorkoutSession[];
  month: string;
}): SummaryMetric[] {
  const reading = getReadingStats(params.readingEntries);
  const gymDays = getHabitDays(params.habitEntries, "gym");
  const uiUxDays = getHabitDays(params.habitEntries, "ui_ux");
  const completion = getHabitCompletionRate(
    params.habits,
    params.habitEntries,
    params.month,
  );
  const bestStreak = getBestHabitStreak(params.habitEntries, params.month);

  return [
    {
      id: "pages",
      label: "Pages read",
      value: String(reading.pagesRead),
      detail: `${reading.readingDays} reading days`,
      tone: "blue",
    },
    {
      id: "gym",
      label: "Gym sessions",
      value: String(gymDays),
      detail: `${params.workoutSessions.length} detailed logs`,
      tone: "green",
    },
    {
      id: "uiux",
      label: "UI/UX days",
      value: String(uiUxDays),
      detail: "habit completions",
      tone: "violet",
    },
    {
      id: "streak",
      label: "Best streak",
      value: `${bestStreak}d`,
      detail: `${completion}% monthly completion`,
      tone: "amber",
    },
  ];
}

export function getDailyIntensity(entries: HabitEntry[], month: string) {
  const days = getMonthDays(month);
  const countByDay = new Map<string, number>();

  for (const entry of entries) {
    if (!entry.completed) continue;
    countByDay.set(entry.date, (countByDay.get(entry.date) ?? 0) + 1);
  }

  return days.map((date) => ({
    date,
    count: countByDay.get(date) ?? 0,
  }));
}

export function getYearMonths(selectedMonth: string) {
  const [year] = selectedMonth.split("-");
  return Array.from({ length: 12 }, (_, index) => {
    const month = String(index + 1).padStart(2, "0");
    return `${year}-${month}`;
  });
}
