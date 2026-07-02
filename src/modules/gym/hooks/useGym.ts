import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPreviousWorkoutSession,
  getWorkoutPrograms,
  getWorkoutSessions,
  saveWorkoutSession,
} from "../services/gymService";
import type { SaveWorkoutInput } from "../types";

export function useWorkoutPrograms(userId: string) {
  return useQuery({
    queryKey: ["workout_programs", userId],
    queryFn: () => getWorkoutPrograms(userId),
    enabled: !!userId,
  });
}

export function useWorkoutSessions(userId: string, month: string) {
  return useQuery({
    queryKey: ["workout_sessions", userId, month],
    queryFn: () => getWorkoutSessions(userId, month),
    enabled: !!userId && !!month,
  });
}

export function usePreviousWorkoutSession(userId: string, programId: string) {
  return useQuery({
    queryKey: ["previous_workout_session", userId, programId],
    queryFn: () => getPreviousWorkoutSession(userId, programId),
    enabled: !!userId && !!programId,
  });
}

export function useSaveWorkoutSession(userId: string, month: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SaveWorkoutInput) => saveWorkoutSession(input),
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({
        queryKey: ["workout_sessions", userId, month],
      });
      queryClient.invalidateQueries({
        queryKey: ["previous_workout_session", userId, input.programId],
      });
    },
  });
}
