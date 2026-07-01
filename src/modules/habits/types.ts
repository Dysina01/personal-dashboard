export interface Habit {
  id: string;
  name: string;
  display_name: string;
  order: number;
}

export interface HabitEntry {
  id: string;
  user_id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  created_at: string;
}

export interface HabitWithEntries extends Habit {
  entries: Record<string, boolean>; // date → completed
}
