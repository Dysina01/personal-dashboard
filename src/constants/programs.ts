export const WORKOUT_PROGRAMS = [
  {
    name: "Chest + Biceps",
    order: 1,
    exercises: [
      "Bench Press",
      "Incline Press",
      "Cable Fly",
      "Barbell Curl",
      "Hammer Curl",
    ],
  },
  {
    name: "Back + Triceps",
    order: 2,
    exercises: [
      "Pull Up",
      "Barbell Row",
      "Lat Pulldown",
      "Tricep Pushdown",
      "Overhead Extension",
    ],
  },
  {
    name: "Legs + Shoulder",
    order: 3,
    exercises: [
      "Squat",
      "Leg Press",
      "Romanian Deadlift",
      "Shoulder Press",
      "Lateral Raise",
    ],
  },
  {
    name: "Push",
    order: 4,
    exercises: [
      "Overhead Press",
      "Incline Dumbbell",
      "Dips",
      "Lateral Raise",
      "Front Raise",
    ],
  },
] as const;
