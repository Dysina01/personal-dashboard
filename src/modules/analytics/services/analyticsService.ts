import { getHabits, getHabitEntries } from "@/modules/habits/services/habitService";
import { getBooks, getAllReadingEntries } from "@/modules/reading/services/readingService";
import { getWorkoutSessions } from "@/modules/gym/services/gymService";
import type { AnalyticsData } from "../types";

export async function getAnalyticsData(
  userId: string,
  month: string,
): Promise<AnalyticsData> {
  const [habits, habitEntries, books, readingEntries, workoutSessions] =
    await Promise.all([
      getHabits(),
      getHabitEntries(userId, month),
      getBooks(userId),
      getAllReadingEntries(userId, month),
      getWorkoutSessions(userId, month),
    ]);

  return {
    habits,
    habitEntries,
    books,
    readingEntries,
    workoutSessions,
  };
}
