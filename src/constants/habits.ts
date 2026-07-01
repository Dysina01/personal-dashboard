export const HABITS = [
  { id: "brush", display_name: "Brush", order: 1 },
  { id: "reading", display_name: "Reading", order: 2 },
  { id: "ui_ux", display_name: "UI/UX", order: 3 },
  { id: "prayer", display_name: "Prayer", order: 4 },
  { id: "gym", display_name: "Gym", order: 5 },
] as const;

export type HabitSlug = (typeof HABITS)[number]["id"];
