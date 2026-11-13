export const moods = [0, 1, 2, 3, 4] as const;
export type Mood = (typeof moods)[number];
export const moodLabels: Record<Mood, string> = {
  0: "Sehr schlecht",
  1: "Schlecht",
  2: "Neutral",
  3: "Gut",
  4: "Sehr gut",
};

// Grenzen wie im Backend (server.js)
export const MAX_NOTES = 2000;
export const MAX_ACTIVITY_LENGTH = 100;

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
  present: "Geschenk gemacht",
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

export const symptoms_physical = {
  muscle: "Muskelkater",
  joint: "Gelenkschmerzen",
  stiff: "Vermehrte Steifheit",
  headache: "Kopfschmerzen",
  throat_pain: "Halsschmerzen",
  stomache: "Magenbeschwerden",
  fit: "Müdigkeit",
  heart: "Herzrasen",
} as const;

export const symptoms_mental = {
  appreciated: "Wertgeschätzt gefühlt",
  euphoric: "Euphorisch",
  sad: "Traurig",
  dizziness: "Schwindel",
  dissociation: "Dissoziation",
  social_battery: "Soziale Batterie ausgelaugt",
  breath: "Atembeschwerden",
} as const;

export const symptoms = { ...symptoms_physical, ...symptoms_mental } as const;
export type SymptomKey = keyof typeof symptoms;

// Gespeichert werden die Keys (z. B. "headache"), damit Umbenennungen der Texte alte Einträge nicht verändern.
// Unbekannte Keys (z. B. gelöschte Symptome) werden beim Laden ignoriert.
export const isSymptomKey = (key: string): key is SymptomKey =>
  Object.hasOwn(symptoms, key);

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

const defaultActivities: string[] = Object.values(activities);

// Alles, was keine Default-Aktivität ist, wurde für den Tag selbst hinzugefügt ("Sonstige")
export const isDefaultActivity = (activity: string): activity is Activity =>
  defaultActivities.includes(activity);

export type DiaryEntry = {
  date: string;
  // null bei alten Einträgen, die nur eine Stimmung hatten
  moodPhysical: Mood | null;
  moodMental: Mood;
  symptoms: SymptomKey[];
  activities: string[];
  notes: string;
};

export type DiaryFormValues = {
  moodPhysical: Mood | null;
  moodMental: Mood | null;
  symptoms: SymptomKey[];
  activities: string[];
  notes: string;
};
