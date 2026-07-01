export function getWeekDays(weekOffset = 0): string[] {
  const today = new Date();
  const day = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7) + weekOffset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getMonthDays(month: string): string[] {
  const [year, m] = month.split("-").map(Number);
  const count = new Date(year, m, 0).getDate();
  return Array.from({ length: count }, (_, i) => {
    const day = String(i + 1).padStart(2, "0");
    return `${year}-${String(m).padStart(2, "0")}-${day}`;
  });
}

export const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
