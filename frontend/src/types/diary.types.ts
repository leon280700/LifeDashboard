export const moods = [0, 1, 2, 3, 4];

export const activities = {
  sport: "Sport",
  meditation: "Meditation",
  spazieren: "Spazieren",
  lesen: "Lesen",
  kochen: "Kochen",
  friends: "Mit Freunden treffen",
  alcohol: "Alkohol",
  relationship: "Beziehung pflegen",
} as const;

export type ActivityKey = keyof typeof activities;
export type Activity = (typeof activities)[ActivityKey];

export type DiaryEntry = {
  date: string;
  mood: number;
  activities: Activity[];
  notes: string;
};
