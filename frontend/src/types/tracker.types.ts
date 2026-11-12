export const GoalTrackerCategories: string[] = [
  "fitness",
  "mental",
  "diet",
  "education",
  "career",
];

export const MAX_GOAL_CONDITION = 200;

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

export type TrackerEntryResponse = {
  date: string;
  checks: {
    goalId: number;
    category: string;
    condition: string;
    achieved: boolean;
  }[];
  notes: string;
};

export type GoalForm = Record<string, { selected: boolean; condition: string }>;

export type DayGoal = {
  category: string;
  condition: string;
  achieved: boolean;
};

export type DayPercent = {
  date: string; // YYYY-MM-DD
  percent: number; // 0-100
  goals: DayGoal[];
};
