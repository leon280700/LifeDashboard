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

export const activities = {
  ...activities_physical,
  ...activities_social,
  ...activities_mental,
  kochen: "Leckeres gekocht",
} as const;

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
