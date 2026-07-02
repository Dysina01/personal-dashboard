export interface WorkoutProgram {
  id: string;
  user_id: string;
  name: string;
  order: number;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  program_id: string;
  name: string;
  order: number;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  program_id: string;
  date: string;
  notes: string | null;
  created_at: string;
  workout_programs?: Pick<WorkoutProgram, "id" | "name" | "order"> | null;
  exercise_sets?: ExerciseSet[];
}

export interface ExerciseSet {
  id: string;
  session_id: string;
  exercise_id: string;
  set_order: number;
  weight_kg: number;
  reps: number;
  exercises?: Pick<Exercise, "id" | "name" | "order"> | null;
}

export interface DraftExerciseSet {
  exerciseId: string;
  setOrder: number;
  weightKg: string;
  reps: string;
}

export interface SaveWorkoutInput {
  userId: string;
  programId: string;
  date: string;
  notes?: string;
  sets: Array<{
    exerciseId: string;
    setOrder: number;
    weightKg: number;
    reps: number;
  }>;
}
