import type { Equipment, MuscleGroup } from '@/types';

export const APP_NAME = 'DAVID N. PERSONAL TRAINING APP';
export const APP_TAGLINE = 'Maximum Strength. Peak Definition. Natural.';
export const APP_DESCRIPTION =
  'A highly personalized fitness plan generator for natural athletes focused on maximum strength and definition.';

export const INJURIES = [
  { id: 'lower-back', label: 'Lower Back' },
  { id: 'shoulder', label: 'Shoulder' },
  { id: 'knee', label: 'Knee' },
  { id: 'elbow', label: 'Elbow' },
  { id: 'wrist', label: 'Wrist' },
  { id: 'hip', label: 'Hip' },
  { id: 'ankle', label: 'Ankle' },
  { id: 'neck', label: 'Neck' },
  { id: 'rotator-cuff', label: 'Rotator Cuff' },
  { id: 'hamstring', label: 'Hamstring' },
];

export const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: 'barbell',    label: 'Barbell' },
  { value: 'dumbbell',   label: 'Dumbbells' },
  { value: 'cable',      label: 'Cable Machine' },
  { value: 'machine',    label: 'Machines' },
  { value: 'bodyweight', label: 'Bodyweight' },
  { value: 'bands',      label: 'Resistance Bands' },
  { value: 'kettlebell', label: 'Kettlebell' },
];

export const WEAK_POINTS: { id: MuscleGroup; label: string }[] = [
  { id: 'chest', label: 'Chest' },
  { id: 'back', label: 'Back' },
  { id: 'shoulders', label: 'Shoulders' },
  { id: 'legs', label: 'Legs' },
  { id: 'arms', label: 'Arms' },
  { id: 'core', label: 'Core' },
  { id: 'calves', label: 'Calves' },
  { id: 'glutes', label: 'Glutes' },
  { id: 'hamstrings', label: 'Hamstrings' },
];

// DIETARY_RESTRICTIONS with value/label defined below

export const SPLIT_NAMES: Record<number, string> = {
  2: 'Full Body A/B',
  3: 'Push / Pull / Legs',
  4: 'Upper / Lower',
  5: 'PPL + Specialization',
  6: '6-Day PPL',
};

export const GOAL_LABELS: Record<string, string> = {
  strength: 'Maximum Strength',
  hypertrophy: 'Muscle Mass',
  definition: 'Lean Definition',
  recomp: 'Body Recomposition',
};

export const GOAL_DESCRIPTIONS: Record<string, string> = {
  strength: 'Build maximal strength with compound lifts and progressive overload.',
  hypertrophy: 'Maximize muscle size through optimal volume and tension.',
  definition: 'Reveal muscular definition with higher rep work and conditioning.',
  recomp: 'Simultaneously build muscle and lose fat — ideal for intermediate athletes.',
};

export const EXPERIENCE_DESCRIPTIONS: Record<string, string> = {
  beginner: '< 1 year of consistent training',
  intermediate: '1–3 years of consistent training',
  advanced: '3+ years of consistent training',
};

export const PROGRESSION_MESSAGES = {
  hit: 'Great work! Add 2.5kg to upper body lifts and 5kg to lower body lifts next session.',
  miss: 'No worries — maintain the same weight and focus on perfect form.',
  deload: 'Time for a deload! Reduce all weights by 40%, maintain reps, and focus on recovery.',
};

export const SUPPLEMENT_RECOMMENDATIONS: Record<string, string[]> = {
  beginner: [
    'Creatine Monohydrate 5g/day',
    'Whey Protein (if needed to hit protein target)',
    'Vitamin D3 2000IU',
  ],
  intermediate: [
    'Creatine Monohydrate 5g/day',
    'Whey Protein',
    'Vitamin D3 + K2',
    'Magnesium Glycinate 400mg',
  ],
  advanced: [
    'Creatine Monohydrate 5g/day',
    'Whey Protein',
    'Vitamin D3 + K2',
    'Magnesium Glycinate 400mg',
    'Zinc 15mg',
    'Omega-3 Fish Oil 2g',
  ],
};

// ─── Aliases with .value prop for step components ─────────────────────────
export const EXPERIENCE_LEVELS = [
  { value: 'beginner',     label: 'Beginner',     description: '< 1 year of consistent training' },
  { value: 'intermediate', label: 'Intermediate',  description: '1–3 years of consistent training' },
  { value: 'advanced',     label: 'Advanced',      description: '3+ years of consistent training' },
];

export const GOALS = [
  { value: 'strength',    label: 'Maximum Strength',      icon: '💪', description: 'Build maximal strength with compound lifts and progressive overload.' },
  { value: 'hypertrophy', label: 'Muscle Mass',           icon: '🏋️', description: 'Maximize muscle size through optimal volume and tension.' },
  { value: 'definition',  label: 'Lean Definition',       icon: '🔥', description: 'Reveal muscular definition with higher rep work and conditioning.' },
  { value: 'recomp',      label: 'Body Recomposition',    icon: '⚖️', description: 'Simultaneously build muscle and lose fat — ideal for intermediate athletes.' },
];

export const SPLIT_LABELS: Record<number, string> = {
  2: 'Full Body A/B',
  3: 'Push / Pull / Legs',
  4: 'Upper / Lower',
  5: 'PPL + Specialization',
  6: '6-Day PPL',
};

export const INJURY_OPTIONS = [
  { value: 'lower-back',   label: 'Lower Back' },
  { value: 'shoulder',     label: 'Shoulder' },
  { value: 'knee',         label: 'Knee' },
  { value: 'elbow',        label: 'Elbow' },
  { value: 'wrist',        label: 'Wrist' },
  { value: 'hip',          label: 'Hip' },
  { value: 'ankle',        label: 'Ankle' },
  { value: 'neck',         label: 'Neck' },
  { value: 'rotator-cuff', label: 'Rotator Cuff' },
  { value: 'hamstring',    label: 'Hamstring' },
];

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary',  description: 'Desk job, minimal daily movement outside the gym.' },
  { value: 'moderate',  label: 'Moderate',   description: 'Some walking, light manual work, or an active lifestyle.' },
  { value: 'active',    label: 'Very Active', description: 'Physical job, sports, or significant daily movement.' },
];

export const MUSCLE_GROUPS = [
  { value: 'chest',      label: 'Chest' },
  { value: 'back',       label: 'Back' },
  { value: 'shoulders',  label: 'Shoulders' },
  { value: 'quads',      label: 'Quads' },
  { value: 'hamstrings', label: 'Hamstrings' },
  { value: 'glutes',     label: 'Glutes' },
  { value: 'calves',     label: 'Calves' },
  { value: 'biceps',     label: 'Biceps' },
  { value: 'triceps',    label: 'Triceps' },
  { value: 'core',       label: 'Core' },
  { value: 'traps',      label: 'Traps' },
];

export const CARDIO_OPTIONS = [
  { value: 'hiit', label: 'HIIT',       description: 'High-intensity intervals — 15-20 min. Maximises fat burn, preserves muscle.' },
  { value: 'liss', label: 'LISS',       description: 'Low-intensity steady state — 20-30 min. Low recovery cost, good for cutting.' },
];

// Overwrite DIETARY_RESTRICTIONS with object form
export const DIETARY_RESTRICTIONS = [
  { value: 'none',              label: 'None' },
  { value: 'vegetarian',        label: 'Vegetarian' },
  { value: 'vegan',             label: 'Vegan' },
  { value: 'gluten-free',       label: 'Gluten-Free' },
  { value: 'lactose-free',      label: 'Lactose-Free' },
  { value: 'halal',             label: 'Halal' },
  { value: 'kosher',            label: 'Kosher' },
];

// EQUIPMENT_OPTIONS with .value for step components (replaces id-based version above)
// Re-export with value alias
export const QUESTIONNAIRE_STEPS = [
  { id: 1,  title: 'Welcome',           description: "Let's build your perfect training plan." },
  { id: 2,  title: 'Your Age',          description: 'Age helps us calibrate recovery and progression.' },
  { id: 3,  title: 'Gender',            description: 'Used for accurate BMR and adjustments.' },
  { id: 4,  title: 'Body Stats',        description: 'Height and weight for nutrition calculations.' },
  { id: 5,  title: 'Experience Level',  description: 'How long have you been training consistently?' },
  { id: 6,  title: 'Primary Goal',      description: 'What are you training for?' },
  { id: 7,  title: 'Training Days',     description: 'How many days per week can you train?' },
  { id: 8,  title: 'Session Duration',  description: 'How long is each training session?' },
  { id: 9,  title: 'Equipment',         description: 'What equipment do you have access to?' },
  { id: 10, title: 'Injuries',          description: 'Any injuries we should work around?' },
  { id: 11, title: 'Current Strength',  description: 'Your approximate 1-rep max lifts.' },
  { id: 12, title: 'Activity Level',    description: 'How active are you outside the gym?' },
  { id: 13, title: 'Sleep & Recovery',  description: 'Recovery quality impacts your results.' },
  { id: 14, title: 'Nutrition',         description: 'Dietary preferences and meal frequency.' },
  { id: 15, title: 'Weak Points',       description: 'Which areas need the most attention?' },
  { id: 16, title: 'Cardio',            description: 'Do you want cardio included in your plan?' },
] as const;
