"use client";

import { useState } from "react";
import { ModuleContainer } from "@/components/shared/layout/ModuleContainer";
import { Section } from "@/components/shared/layout/Section";
import { EmptyState } from "@/components/shared/feedback/EmptyState";
import { ErrorState } from "@/components/shared/feedback/ErrorState";
import { ProgramCard, ProgramCardSkeleton } from "./components/ProgramCard";
import { SessionHistory } from "./components/SessionHistory";
import { WorkoutSheet } from "./components/WorkoutSheet";
import { useWorkoutPrograms, useWorkoutSessions } from "./hooks/useGym";
import type { WorkoutProgram } from "./types";

interface Props {
  userId: string;
  month: string;
}

export function GymModule({ userId, month }: Props) {
  const [selectedProgram, setSelectedProgram] =
    useState<WorkoutProgram | null>(null);

  const {
    data: programs = [],
    isLoading: loadingPrograms,
    isError: programsError,
    refetch: refetchPrograms,
  } = useWorkoutPrograms(userId);

  const {
    data: sessions = [],
    isLoading: loadingSessions,
    isError: sessionsError,
    refetch: refetchSessions,
  } = useWorkoutSessions(userId, month);

  const isLoading = loadingPrograms || loadingSessions;
  const isError = programsError || sessionsError;

  function getLastSession(programId: string) {
    return sessions.find((session) => session.program_id === programId);
  }

  return (
    <>
      <ModuleContainer>
        {isLoading ? (
          <Section label="Programs">
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map((i) => (
                <ProgramCardSkeleton key={i} />
              ))}
            </div>
          </Section>
        ) : isError ? (
          <ErrorState
            onRetry={() => {
              refetchPrograms();
              refetchSessions();
            }}
          />
        ) : programs.length === 0 ? (
          <EmptyState
            title="No workout programs"
            description="Add the four static programs in Supabase first."
          />
        ) : (
          <>
            <Section label="Programs">
              <div className="flex flex-col gap-3">
                {programs.map((program) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    lastSession={getLastSession(program.id)}
                    onSelect={() => setSelectedProgram(program)}
                  />
                ))}
              </div>
            </Section>

            <Section label="This month">
              <SessionHistory sessions={sessions} />
            </Section>
          </>
        )}
      </ModuleContainer>

      {selectedProgram && (
        <BottomSheet onClose={() => setSelectedProgram(null)}>
          <WorkoutSheet
            userId={userId}
            month={month}
            program={selectedProgram}
            onClose={() => setSelectedProgram(null)}
          />
        </BottomSheet>
      )}
    </>
  );
}

function BottomSheet({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative max-h-[90vh] overflow-y-auto rounded-sheet rounded-b-none border-t border-border bg-surface-2 shadow-sheet">
        {children}
      </div>
    </div>
  );
}
