import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHabits,
  getHabitEntries,
  toggleHabitEntry,
} from "../services/habitService";
import type { HabitEntry } from "../types";

export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: getHabits,
    staleTime: Infinity,
  });
}

export function useHabitEntries(userId: string, month: string) {
  return useQuery({
    queryKey: ["habit_entries", userId, month],
    queryFn: () => getHabitEntries(userId, month),
    enabled: !!userId && !!month,
  });
}

export function useToggleHabit(userId: string, month: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      habitId,
      date,
      completed,
    }: {
      habitId: string;
      date: string;
      completed: boolean;
    }) => toggleHabitEntry(userId, habitId, date, completed),

    // optimistic update
    onMutate: async ({ habitId, date, completed }) => {
      const key = ["habit_entries", userId, month];
      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<HabitEntry[]>(key);

      queryClient.setQueryData<HabitEntry[]>(key, (old = []) => {
        const exists = old.find(
          (e) => e.habit_id === habitId && e.date === date,
        );
        if (exists) {
          return old.map((e) =>
            e.habit_id === habitId && e.date === date ? { ...e, completed } : e,
          );
        }
        return [
          ...old,
          {
            id: crypto.randomUUID(),
            user_id: userId,
            habit_id: habitId,
            date,
            completed,
            created_at: new Date().toISOString(),
          },
        ];
      });

      return { previous };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(
          ["habit_entries", userId, month],
          ctx.previous,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["habit_entries", userId, month],
      });
    },
  });
}
