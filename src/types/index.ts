export type TabId = "analytics" | "habits" | "reading" | "gym";

export interface Tab {
  id: TabId;
  label: string;
  icon?: React.ReactNode; // 👈 آیکون خودتو اینجا بذار، مثلاً <ChartBar />
}

export const TABS: Tab[] = [
  { id: "analytics", label: "Analytics" },
  { id: "habits", label: "Habit Tracker" },
  { id: "reading", label: "Reading" },
  { id: "gym", label: "Gym" },
];
