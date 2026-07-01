import { create } from "zustand";
import { type TabId } from "@/types";
import { getCurrentMonth } from "@/lib/utils";

interface DashboardStore {
  selectedMonth: string;
  activeTab: TabId;
  setMonth: (month: string) => void;
  setTab: (tab: TabId) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  selectedMonth: getCurrentMonth(),
  activeTab: "analytics",
  setMonth: (month) => set({ selectedMonth: month }),
  setTab: (tab) => set({ activeTab: tab }),
}));
