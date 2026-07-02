"use client";

import { useMemo, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import {
  usePreviousWorkoutSession,
  useSaveWorkoutSession,
} from "../hooks/useGym";
import type { DraftExerciseSet, WorkoutProgram } from "../types";

interface Props {
  userId: string;
  month: string;
  program: WorkoutProgram;
  onClose: () => void;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function createDraftSet(exerciseId: string, setOrder: number): DraftExerciseSet {
  return {
    exerciseId,
    setOrder,
    weightKg: "",
    reps: "",
  };
}

export function WorkoutSheet({ userId, month, program, onClose }: Props) {
  const exercises = program.exercises ?? [];
  const [date, setDate] = useState(today());
  const [notes, setNotes] = useState("");
  const [sets, setSets] = useState<DraftExerciseSet[]>(() =>
    exercises.map((exercise) => createDraftSet(exercise.id, 1)),
  );
  const [error, setError] = useState<string | null>(null);

  const saveWorkout = useSaveWorkoutSession(userId, month);
  const { data: previousSession } = usePreviousWorkoutSession(userId, program.id);

  const completeSets = useMemo(
    () =>
      sets
        .map((set) => ({
          ...set,
          weight: Number(set.weightKg),
          repsCount: Number(set.reps),
        }))
        .filter(
          (set) =>
            set.weightKg.trim() !== "" &&
            set.reps.trim() !== "" &&
            Number.isFinite(set.weight) &&
            Number.isFinite(set.repsCount) &&
            set.weight > 0 &&
            set.repsCount > 0,
        ),
    [sets],
  );

  function updateSet(
    index: number,
    key: keyof Pick<DraftExerciseSet, "weightKg" | "reps">,
    value: string,
  ) {
    setError(null);
    setSets((current) =>
      current.map((set, i) => (i === index ? { ...set, [key]: value } : set)),
    );
  }

  function addSet(exerciseId: string) {
    setSets((current) => {
      const nextOrder =
        current.filter((set) => set.exerciseId === exerciseId).length + 1;
      return [...current, createDraftSet(exerciseId, nextOrder)];
    });
  }

  function removeSet(index: number) {
    setError(null);
    setSets((current) => current.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!date) {
      setError("Choose a workout date.");
      return;
    }

    if (completeSets.length === 0) {
      setError("Add at least one completed set.");
      return;
    }

    setError(null);

    await saveWorkout.mutateAsync({
      userId,
      programId: program.id,
      date,
      notes: notes.trim(),
      sets: completeSets.map((set) => ({
        exerciseId: set.exerciseId,
        setOrder: set.setOrder,
        weightKg: set.weight,
        reps: set.repsCount,
      })),
    });

    onClose();
  }

  return (
    <div className="flex max-h-[90vh] flex-col pb-8">
      <div className="flex justify-center pb-2 pt-3">
        <div className="h-1 w-9 rounded-full bg-border-strong" />
      </div>

      <div className="px-5">
        <div className="mb-5">
          <p className="text-title font-semibold text-text-primary">
            {program.name}
          </p>
          <p className="mt-1 text-caption text-text-muted">
            Log the sets you actually completed.
          </p>
        </div>

        <div className="mb-5 grid grid-cols-[1fr_auto] gap-2">
          <input
            className="h-12 rounded-input border border-border bg-fill-primary px-4 text-body text-text-primary focus:border-accent focus:bg-accent-50 focus:outline-none"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
          <div className="flex h-12 items-center rounded-input bg-fill-primary px-4 text-caption text-text-tertiary">
            {completeSets.length} sets
          </div>
        </div>

        {previousSession && (
          <div className="mb-5 rounded-card border border-border bg-fill-secondary p-4">
            <p className="text-caption font-medium uppercase tracking-wider text-text-muted">
              Previous {previousSession.date}
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {(previousSession.exercise_sets ?? []).slice(0, 4).map((set) => (
                <div
                  key={set.id}
                  className="flex items-center justify-between gap-3 text-caption"
                >
                  <span className="truncate text-text-secondary">
                    {set.exercises?.name ?? "Exercise"}
                  </span>
                  <span className="shrink-0 font-medium text-text-primary">
                    {set.weight_kg}kg x {set.reps}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-5">
          {exercises.map((exercise) => {
            const exerciseSets = sets
              .map((set, index) => ({ ...set, index }))
              .filter((set) => set.exerciseId === exercise.id);

            return (
              <div key={exercise.id}>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-callout font-medium text-text-secondary">
                    {exercise.name}
                  </p>
                  <button
                    onClick={() => addSet(exercise.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-fill-primary text-text-tertiary active:scale-95"
                    aria-label={`Add set for ${exercise.name}`}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  {exerciseSets.map((set) => (
                    <div
                      key={`${set.exerciseId}-${set.index}`}
                      className="grid grid-cols-[40px_1fr_1fr_36px] items-center gap-2"
                    >
                      <div className="text-center text-caption font-medium text-text-muted">
                        {set.setOrder}
                      </div>
                      <input
                        className="h-11 rounded-input border border-border bg-fill-primary px-3 text-center text-callout text-text-primary placeholder:text-text-muted focus:border-accent focus:bg-accent-50 focus:outline-none"
                        type="number"
                        inputMode="decimal"
                        placeholder="kg"
                        value={set.weightKg}
                        onChange={(event) =>
                          updateSet(set.index, "weightKg", event.target.value)
                        }
                      />
                      <input
                        className="h-11 rounded-input border border-border bg-fill-primary px-3 text-center text-callout text-text-primary placeholder:text-text-muted focus:border-accent focus:bg-accent-50 focus:outline-none"
                        type="number"
                        inputMode="numeric"
                        placeholder="reps"
                        value={set.reps}
                        onChange={(event) =>
                          updateSet(set.index, "reps", event.target.value)
                        }
                      />
                      <button
                        onClick={() => removeSet(set.index)}
                        className="flex h-9 w-9 items-center justify-center rounded-full text-text-muted active:scale-95"
                        aria-label={`Remove set ${set.setOrder}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <textarea
          className="mt-5 min-h-20 w-full resize-none rounded-input border border-border bg-fill-primary px-4 py-3 text-callout text-text-primary placeholder:text-text-muted focus:border-accent focus:bg-accent-50 focus:outline-none"
          placeholder="Notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
        />

        {error && (
          <p className="mt-3 text-caption" style={{ color: "var(--error)" }}>
            {error}
          </p>
        )}

        <button
          onClick={handleSave}
          disabled={saveWorkout.isPending}
          className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-btn bg-accent text-body font-medium text-white disabled:opacity-40 active:scale-[0.97] transition-transform duration-instant"
        >
          <Save size={18} />
          {saveWorkout.isPending ? "Saving..." : "Save Workout"}
        </button>
      </div>
    </div>
  );
}
