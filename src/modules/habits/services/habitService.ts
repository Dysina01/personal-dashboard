import { createClient } from "@/lib/supabase/client";
import type { Habit, HabitEntry } from "../types";

const supabase = createClient();

export async function getHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .order("order");

  if (error) throw error;
  return data;
}

export async function getHabitEntries(
  userId: string,
  month: string,
): Promise<HabitEntry[]> {
  const [year, m] = month.split("-");
  const from = `${year}-${m}-01`;
  const to = new Date(Number(year), Number(m), 0).toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("habit_entries")
    .select("*")
    .eq("user_id", userId)
    .gte("date", from)
    .lte("date", to);

  if (error) throw error;
  return data;
}

export async function toggleHabitEntry(
  userId: string,
  habitId: string,
  date: string,
  completed: boolean,
): Promise<void> {
  const { error } = await supabase
    .from("habit_entries")
    .upsert(
      { user_id: userId, habit_id: habitId, date, completed },
      { onConflict: "user_id,habit_id,date" },
    );

  if (error) throw error;
}
