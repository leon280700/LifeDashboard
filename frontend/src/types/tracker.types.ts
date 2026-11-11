export const GoalTrackerCategories: string[] = [
  "fitness",
  "mental",
  "diet",
  "education",
  "career",
];

export type Goal = {
  id: number;
  category: string;
  condition: string;
  activeFrom: string;
};

export type GoalInput = Pick<Goal, "category" | "condition">;

export type TrackerEntry = {
  date: string; // YYYY-MM-DD
  checks: Record<number, boolean>; // goalId -> erreicht
  notes: string;
};

export type GoalForm = Record<string, { selected: boolean; condition: string }>;
