import { createClient } from "@/lib/supabase/client";
import type {
  SaveWorkoutInput,
  WorkoutProgram,
  WorkoutSession,
} from "../types";

const supabase = createClient();

function getMonthRange(month: string) {
  const [year, m] = month.split("-");
  const from = `${year}-${m}-01`;
  const to = new Date(Number(year), Number(m), 0).toISOString().slice(0, 10);

  return { from, to };
}

export async function getWorkoutPrograms(
  userId: string,
): Promise<WorkoutProgram[]> {
  const { data, error } = await supabase
    .from("workout_programs")
    .select("*, exercises(*)")
    .eq("user_id", userId)
    .order("order")
    .order("order", { referencedTable: "exercises" });

  if (error) throw error;
  return data;
}

export async function getWorkoutSessions(
  userId: string,
  month: string,
): Promise<WorkoutSession[]> {
  const { from, to } = getMonthRange(month);

  const { data, error } = await supabase
    .from("workout_sessions")
    .select(
      "*, workout_programs(id, name, order), exercise_sets(*, exercises(id, name, order))",
    )
    .eq("user_id", userId)
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: false })
    .order("set_order", {
      referencedTable: "exercise_sets",
      ascending: true,
    });

  if (error) throw error;
  return data;
}

export async function getPreviousWorkoutSession(
  userId: string,
  programId: string,
): Promise<WorkoutSession | null> {
  const { data, error } = await supabase
    .from("workout_sessions")
    .select("*, exercise_sets(*, exercises(id, name, order))")
    .eq("user_id", userId)
    .eq("program_id", programId)
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function saveWorkoutSession(
  input: SaveWorkoutInput,
): Promise<WorkoutSession> {
  const { data: session, error: sessionError } = await supabase
    .from("workout_sessions")
    .insert({
      user_id: input.userId,
      program_id: input.programId,
      date: input.date,
      notes: input.notes || null,
    })
    .select()
    .single();

  if (sessionError) throw sessionError;

  if (input.sets.length > 0) {
    const { error: setsError } = await supabase.from("exercise_sets").insert(
      input.sets.map((set) => ({
        session_id: session.id,
        exercise_id: set.exerciseId,
        set_order: set.setOrder,
        weight_kg: set.weightKg,
        reps: set.reps,
      })),
    );

    if (setsError) throw setsError;
  }

  return session;
}
