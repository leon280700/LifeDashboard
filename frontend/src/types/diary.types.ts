export const moods = [0, 1, 2, 3, 4];

const activities_physical = {
  skate: "Skaten gewesen",
  badminton: "Badminton gespielt",
  gym: "Im Fitnessstudio gewesen",
  running: "Laufen gewesen",
} as const;

const activities_social = {
  friends: "Mit Freunden etwas unternommen",
  me_time: "Alleine etwas unternommen",
  cinema: "Im Kino gewesen",
  fleamarket: "Auf einem Flohmarkt gewesen",
  relationship: "Beziehung gepflegt",
  concert: "Konzert/ Festival besucht",
  alcohol: "Alkohol getrunken",
  games_analog: "Brettspiele/ Kartenspiele gespielt",
} as const;

const activities_mental = {
  games: "Videospiele gespielt",
  journal: "Tagebuch geschrieben",
  meditate: "Meditiert",
  project: "An persönlichem Projekt gearbeitet",
} as const;

const activities_everyday = {
  kochen: "Etwas leckeres gekocht",
} as const;

export const activities = {
  ...activities_physical,
  ...activities_social,
  ...activities_mental,
  ...activities_everyday,
} as const;

export type ActivityCategoryKey = "physical" | "social" | "mental" | "everyday";

export type ActivityCategory = {
  key: ActivityCategoryKey;
  label: string;
  activities: Partial<Record<ActivityKey, Activity>>;
};

export const activityCategories: ActivityCategory[] = [
  { key: "physical", label: "Bewegung", activities: activities_physical },
  { key: "social", label: "Soziales", activities: activities_social },
  { key: "mental", label: "Geist & Freizeit", activities: activities_mental },
  { key: "everyday", label: "Alltag", activities: activities_everyday },
];

export type ActivityKey = keyof typeof activities;
export type Activity = (typeof activities)[ActivityKey];

export type DiaryEntry = {
  date: string;
  mood: number;
  activities: Activity[];
  notes: string;
};

export type DiaryFormValues = {
  mood: number | null;
  activities: Activity[];
  notes: string;
};
