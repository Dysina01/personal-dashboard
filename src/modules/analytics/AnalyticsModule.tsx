"use client";

import {
  BookOpen,
  Dumbbell,
  Flame,
  Layers3,
  Palette,
  Trophy,
} from "lucide-react";
import { ModuleContainer } from "@/components/shared/layout/ModuleContainer";
import { Section } from "@/components/shared/layout/Section";
import { StatsGrid } from "@/components/shared/layout/StatsGrid";
import { ErrorState } from "@/components/shared/feedback/ErrorState";
import { useAnalytics } from "./hooks/useAnalytics";
import { SummaryCard } from "./components/SummaryCard";
import { CurrentBookCard } from "./components/CurrentBookCard";
import { HabitPulse } from "./components/HabitPulse";
import { ActivityHeatmap } from "./components/ActivityHeatmap";
import { YearDashboard } from "./components/YearDashboard";
import {
  buildSummaryMetrics,
  getCurrentBookProgress,
  getDailyIntensity,
} from "./utils";

interface Props {
  userId: string;
  month: string;
}

const icons = {
  pages: BookOpen,
  gym: Dumbbell,
  uiux: Palette,
  streak: Flame,
};

export function AnalyticsModule({ userId, month }: Props) {
  const { data, isLoading, isError, refetch } = useAnalytics(userId, month);

  if (isLoading) {
    return (
      <ModuleContainer>
        <Section>
          <div className="h-44 rounded-card bg-fill-primary animate-pulse" />
        </Section>
        <StatsGrid className="mt-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="h-32 rounded-card bg-fill-primary animate-pulse"
            />
          ))}
        </StatsGrid>
      </ModuleContainer>
    );
  }

  if (isError || !data) {
    return (
      <ModuleContainer>
        <ErrorState onRetry={refetch} />
      </ModuleContainer>
    );
  }

  const metrics = buildSummaryMetrics({
    habits: data.habits,
    habitEntries: data.habitEntries,
    readingEntries: data.readingEntries,
    workoutSessions: data.workoutSessions,
    month,
  });
  const currentBook = getCurrentBookProgress(data.books, data.readingEntries);
  const heatmap = getDailyIntensity(data.habitEntries, month);

  return (
    <ModuleContainer>
      <Section>
        <div className="relative overflow-hidden rounded-card border border-border bg-text-primary p-5 text-white shadow-dialog">
          <div className="absolute right-4 top-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <Trophy size={24} />
          </div>
          <p className="text-caption font-medium uppercase tracking-wider text-white/55">
            Personal OS
          </p>
          <p className="mt-3 max-w-64 text-display font-semibold">
            Your month is taking shape.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2">
            <HeroPill label="Habits" value={String(data.habitEntries.filter((entry) => entry.completed).length)} />
            <HeroPill label="Books" value={String(data.books.filter((book) => book.status === "active").length)} />
            <HeroPill label="Logs" value={String(data.workoutSessions.length)} />
          </div>
        </div>
      </Section>

      <Section label="Core metrics">
        <StatsGrid>
          {metrics.map((metric) => {
            const Icon = icons[metric.id as keyof typeof icons] ?? Layers3;
            return <SummaryCard key={metric.id} metric={metric} icon={Icon} />;
          })}
        </StatsGrid>
      </Section>

      <Section label="Reading">
        <CurrentBookCard progress={currentBook} />
      </Section>

      <Section label="Habits">
        <HabitPulse habits={data.habits} entries={data.habitEntries} />
      </Section>

      <Section label="Activity">
        <ActivityHeatmap days={heatmap} />
      </Section>

      <Section label="Year">
        <YearDashboard selectedMonth={month} entries={data.habitEntries} />
      </Section>
    </ModuleContainer>
  );
}

function HeroPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm bg-white/10 px-3 py-2">
      <p className="text-caption text-white/55">{label}</p>
      <p className="text-headline font-semibold text-white">{value}</p>
    </div>
  );
}
