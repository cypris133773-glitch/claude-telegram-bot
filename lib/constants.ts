import type { Equipment, MuscleGroup } from '@/types';

export const APP_NAME = 'DAVID N. PERSONAL TRAINING APP';
export const APP_TAGLINE = 'Maximale Kraft. Optimale Definition. Natürlich.';
export const APP_DESCRIPTION =
  'Ein hochpersonalisierter Fitnessplan-Generator für natürliche Athleten mit Fokus auf maximale Kraft und Definition.';

export const INJURIES = [
  { id: 'lower-back', label: 'Unterer Rücken' },
  { id: 'shoulder', label: 'Schulter' },
  { id: 'knee', label: 'Knie' },
  { id: 'elbow', label: 'Ellbogen' },
  { id: 'wrist', label: 'Handgelenk' },
  { id: 'hip', label: 'Hüfte' },
  { id: 'ankle', label: 'Knöchel' },
  { id: 'neck', label: 'Nacken' },
  { id: 'rotator-cuff', label: 'Rotatorenmanschette' },
  { id: 'hamstring', label: 'Oberschenkelrückseite' },
];

export const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: 'barbell',      label: 'Langhantel' },
  { value: 'dumbbell',     label: 'Kurzhanteln' },
  { value: 'cable',        label: 'Kabelzug' },
  { value: 'machine',      label: 'Maschinen' },
  { value: 'pull-up-bar',  label: 'Klimmzugstange' },
  { value: 'dip-station',  label: 'Dip-Station' },
  { value: 'kettlebell',   label: 'Kettlebell' },
  { value: 'bands',        label: 'Widerstandsband' },
  { value: 'bodyweight',   label: 'Körpergewicht' },
];

export const WEAK_POINTS: { id: MuscleGroup; label: string }[] = [
  { id: 'chest', label: 'Brust' },
  { id: 'back', label: 'Rücken' },
  { id: 'shoulders', label: 'Schultern' },
  { id: 'legs', label: 'Beine' },
  { id: 'arms', label: 'Arme' },
  { id: 'core', label: 'Rumpf' },
  { id: 'calves', label: 'Waden' },
  { id: 'glutes', label: 'Gesäß' },
  { id: 'hamstrings', label: 'Oberschenkelrückseite' },
];

// DIETARY_RESTRICTIONS with value/label defined below

export const SPLIT_NAMES: Record<number, string> = {
  2: 'Ganzkörper A/B',
  3: 'Drücken / Ziehen / Beine',
  4: 'Oberkörper / Unterkörper',
  5: 'PPL + Spezialisierung',
  6: '6-Tage PPL',
};

export const GOAL_LABELS: Record<string, string> = {
  strength: 'Kraft',
  hypertrophy: 'Muskelaufbau',
  definition: 'Definition',
  recomp: 'Recomposition',
  health: 'Gesundheit',
};

export const GOAL_DESCRIPTIONS: Record<string, string> = {
  strength: 'Maximale Kraft mit Grundübungen und progressiver Überlastung aufbauen.',
  hypertrophy: 'Muskelgröße durch optimales Volumen und Muskelspannung maximieren.',
  definition: 'Muskeldefinition durch höhere Wiederholungszahlen und Konditionierung herausarbeiten.',
  recomp: 'Gleichzeitig Muskeln aufbauen und Fett verlieren — ideal für Fortgeschrittene.',
  health: 'Fit & gesund bleiben mit ausgewogenem Training für Körper und Geist.',
};

export const EXPERIENCE_DESCRIPTIONS: Record<string, string> = {
  beginner: '< 1 Jahr konsequentes Training',
  intermediate: '1–3 Jahre konsequentes Training',
  advanced: '3+ Jahre konsequentes Training',
};

export const PROGRESSION_MESSAGES = {
  hit: 'Gut gemacht! Erhöhe das Gewicht beim nächsten Training um 2,5 kg (Oberkörper) bzw. 5 kg (Unterkörper).',
  miss: 'Kein Problem — behalte das gleiche Gewicht und fokussiere dich auf saubere Technik.',
  deload: 'Zeit für einen Deload! Reduziere alle Gewichte um 40 %, behalte die Wiederholungen und erhol dich.',
};

export const SUPPLEMENT_RECOMMENDATIONS: Record<string, string[]> = {
  beginner: [
    'Kreatin Monohydrat 5g/Tag',
    'Whey Protein (falls nötig, um Proteinziel zu erreichen)',
    'Vitamin D3 2000 IE',
  ],
  intermediate: [
    'Kreatin Monohydrat 5g/Tag',
    'Whey Protein',
    'Vitamin D3 + K2',
    'Magnesiumglycinat 400 mg',
  ],
  advanced: [
    'Kreatin Monohydrat 5g/Tag',
    'Whey Protein',
    'Vitamin D3 + K2',
    'Magnesiumglycinat 400 mg',
    'Zink 15 mg',
    'Omega-3 Fischöl 2 g',
  ],
};

// ─── Aliases with .value prop for step components ─────────────────────────
export const EXPERIENCE_LEVELS = [
  { value: 'beginner',     label: 'Anfänger',       description: '0–6 Monate' },
  { value: 'intermediate', label: 'Fortgeschritten', description: '6 Monate – 2 Jahre' },
  { value: 'advanced',     label: 'Profi',           description: '2+ Jahre' },
];

export const GOALS = [
  { value: 'hypertrophy', label: 'Muskelaufbau',        icon: '🏋️', description: 'Muskelmasse durch optimales Volumen und Muskelspannung aufbauen.' },
  { value: 'strength',    label: 'Kraft',               icon: '💪', description: 'Maximale Kraft mit Grundübungen und progressiver Überlastung steigern.' },
  { value: 'definition',  label: 'Definition',          icon: '🔥', description: 'Körperdefinition durch höhere Wiederholungszahlen und Konditionierung.' },
  { value: 'recomp',      label: 'Recomposition',       icon: '⚖️', description: 'Gleichzeitig Muskeln aufbauen und Fett verlieren.' },
  { value: 'health',      label: 'Gesundheit',          icon: '❤️', description: 'Fit & gesund bleiben mit ausgewogenem Training.' },
];

export const SPLIT_LABELS: Record<number, string> = {
  2: 'Ganzkörper A/B',
  3: 'Drücken / Ziehen / Beine',
  4: 'Oberkörper / Unterkörper',
  5: 'PPL + Spezialisierung',
  6: '6-Tage PPL',
};

export const INJURY_OPTIONS = [
  { value: 'lower-back',   label: 'Unterer Rücken' },
  { value: 'shoulder',     label: 'Schulter' },
  { value: 'knee',         label: 'Knie' },
  { value: 'elbow',        label: 'Ellbogen' },
  { value: 'wrist',        label: 'Handgelenk' },
  { value: 'hip',          label: 'Hüfte' },
  { value: 'ankle',        label: 'Knöchel' },
  { value: 'neck',         label: 'Nacken' },
  { value: 'rotator-cuff', label: 'Rotatorenmanschette' },
  { value: 'hamstring',    label: 'Oberschenkelrückseite' },
];

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sitzend',     description: 'Bürojob, minimale Bewegung außerhalb des Gyms.' },
  { value: 'moderate',  label: 'Moderat',     description: 'Etwas Gehen, leichte körperliche Arbeit oder aktiver Lebensstil.' },
  { value: 'active',    label: 'Sehr aktiv',  description: 'Körperlich anspruchsvoller Job, Sport oder viel Bewegung täglich.' },
];

export const MUSCLE_GROUPS = [
  { value: 'chest',      label: 'Brust' },
  { value: 'back',       label: 'Rücken' },
  { value: 'shoulders',  label: 'Schultern' },
  { value: 'quads',      label: 'Quadrizeps' },
  { value: 'hamstrings', label: 'Oberschenkelrückseite' },
  { value: 'glutes',     label: 'Gesäß' },
  { value: 'calves',     label: 'Waden' },
  { value: 'biceps',     label: 'Bizeps' },
  { value: 'triceps',    label: 'Trizeps' },
  { value: 'core',       label: 'Rumpf' },
  { value: 'traps',      label: 'Trapezmuskel' },
];

export const CARDIO_OPTIONS = [
  { value: 'hiit', label: 'HIIT', description: 'Hochintensives Intervalltraining — 15–20 Min. Maximiert Fettverbrennung, erhält Muskeln.' },
  { value: 'liss', label: 'LISS', description: 'Niedrigintensives Ausdauertraining — 20–30 Min. Geringer Erholungsaufwand, gut für den Schnitt.' },
];

// Overwrite DIETARY_RESTRICTIONS with object form
export const DIETARY_RESTRICTIONS = [
  { value: 'none',              label: 'Keine' },
  { value: 'vegetarian',        label: 'Vegetarisch' },
  { value: 'vegan',             label: 'Vegan' },
  { value: 'gluten-free',       label: 'Glutenfrei' },
  { value: 'lactose-free',      label: 'Laktosefrei' },
  { value: 'halal',             label: 'Halal' },
  { value: 'kosher',            label: 'Koscher' },
];

// EQUIPMENT_OPTIONS with .value for step components (replaces id-based version above)
// Re-export with value alias
export const QUESTIONNAIRE_STEPS = [
  { id: 1,  title: 'Willkommen',          description: 'Lass uns deinen perfekten Trainingsplan erstellen.' },
  { id: 2,  title: 'Dein Alter',          description: 'Das Alter hilft uns, Erholung und Progression zu kalibrieren.' },
  { id: 3,  title: 'Geschlecht',          description: 'Wird für genaue BMR-Berechnungen und Anpassungen verwendet.' },
  { id: 4,  title: 'Körperdaten',         description: 'Größe und Gewicht für Ernährungsberechnungen.' },
  { id: 5,  title: 'Erfahrungsstufe',     description: 'Wie lange trainierst du bereits konsequent?' },
  { id: 6,  title: 'Hauptziel',           description: 'Wofür trainierst du?' },
  { id: 7,  title: 'Trainingstage',       description: 'Wie viele Tage pro Woche kannst du trainieren?' },
  { id: 8,  title: 'Einheitsdauer',       description: 'Wie lange dauert jede Trainingseinheit?' },
  { id: 9,  title: 'Ausrüstung',          description: 'Welche Ausrüstung steht dir zur Verfügung?' },
  { id: 10, title: 'Verletzungen',        description: 'Gibt es Verletzungen, die wir berücksichtigen sollen?' },
  { id: 11, title: 'Aktuelle Leistungen', description: 'Deine ungefähren 1-Wiederholungs-Maximalgewichte.' },
  { id: 12, title: 'Aktivitätslevel',     description: 'Wie aktiv bist du außerhalb des Gyms?' },
  { id: 13, title: 'Schlaf & Erholung',   description: 'Erholungsqualität beeinflusst deine Ergebnisse.' },
  { id: 14, title: 'Ernährung',           description: 'Ernährungspräferenzen und Mahlzeitenhäufigkeit.' },
  { id: 15, title: 'Schwachpunkte',       description: 'Welche Bereiche brauchen die meiste Aufmerksamkeit?' },
  { id: 16, title: 'Cardio',             description: 'Soll Cardio in deinen Plan integriert werden?' },
] as const;
