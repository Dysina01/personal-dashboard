"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto">
      <div className="sticky top-0 z-10 bg-surface-0 pt-2">
        <div className="flex items-center justify-between px-5 pb-1">
          <div className="w-8" />
          <MonthSelector selectedMonth={selectedMonth} onChange={setMonth} />
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="flex h-8 w-8 items-center justify-center rounded-full text-text-tertiary active:scale-90 active:bg-fill-primary transition-transform duration-instant"
          >
            <LogOut size={17} />
          </button>
        </div>

        <NavChips
          tabs={TABS}
          activeTab={activeTab}
          onChange={(id) => setTab(id as TabId)}
        />
      </div>

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
