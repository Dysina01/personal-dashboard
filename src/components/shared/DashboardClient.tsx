"use client";

import { QueryProvider } from "@/components/shared/QueryProvider";
import { MonthSelector } from "@/components/shared/MonthSelector";
import { NavChips } from "@/components/shared/NavChips";
import { useDashboardStore } from "@/stores/dashboardStore";
import { TABS, type TabId } from "@/types";
import { HabitsModule } from "@/modules/habits/HabitsModule";
import { ReadingModule } from "@/modules/reading/ReadingModule";
import { GymModule } from "@/modules/gym/GymModule";
import { AnalyticsModule } from "@/modules/analytics/AnalyticsModule";

function DashboardContent({ userId }: { userId: string }) {
  const { selectedMonth, activeTab, setMonth, setTab } = useDashboardStore();

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto">
      {/* sticky header */}
      <div className="sticky top-0 z-10 bg-surface-0 pt-2">
        <MonthSelector selectedMonth={selectedMonth} onChange={setMonth} />
        <NavChips
          tabs={TABS}
          activeTab={activeTab}
          onChange={(id) => setTab(id as TabId)}
        />
      </div>

      {/* module content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "analytics" && (
          <AnalyticsModule userId={userId} month={selectedMonth} />
        )}
        {activeTab === "habits" && (
          <HabitsModule userId={userId} month={selectedMonth} />
        )}
        {activeTab === "reading" && <ReadingModule userId={userId} />}
        {activeTab === "gym" && (
          <GymModule userId={userId} month={selectedMonth} />
        )}
      </div>
    </div>
  );
}

export function DashboardClient({ userId }: { userId: string }) {
  return (
    <QueryProvider>
      <DashboardContent userId={userId} />
    </QueryProvider>
  );
}
