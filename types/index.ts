export type Goal = 'strength' | 'hypertrophy' | 'definition' | 'recomp' | 'health';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';
export type Gender = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'moderate' | 'active';
export type Equipment = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'bands' | 'kettlebell' | 'pull-up-bar' | 'dip-station';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type MuscleGroup =
  | 'chest' | 'back' | 'shoulders' | 'legs' | 'arms' | 'core'
  | 'calves' | 'glutes' | 'hamstrings' | 'quads' | 'biceps'
  | 'triceps' | 'traps' | 'lats';

export interface SetsRepsScheme {
  sets: number;
  reps: string;
  rest: string;
  rir?: number;
}

export interface RecommendedSetsReps {
  strength: SetsRepsScheme;
  hypertrophy: SetsRepsScheme;
  definition: SetsRepsScheme;
  recomp: SetsRepsScheme;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  difficulty: Difficulty;
  equipment: Equipment[];
  injuriesToAvoid: string[];
  recommendedSetsReps: RecommendedSetsReps;
  formCues: string[];
  commonMistakes: string[];
  alternatives: string[];
  pros?: string[];
  cons?: string[];
  videoPlaceholder?: string;
}

export interface PlannedExercise {
  exerciseId: string;
  exercise: Exercise;
  sets: number;
  reps: string;
  rest: string;
  targetWeight?: number;
  rir?: number;
  notes?: string;
}

export interface TrainingDay {
  name: string;
  focus: string;
  exercises: PlannedExercise[];
  duration: number;
}

export interface WeeklyPlan {
  days: TrainingDay[];
  splitType: string;
}

export interface MacroTargets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NutritionPlan {
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: MacroTargets;
  preworkout: string;
  postworkout: string;
  mealTiming: string[];
  hydration: string;
  supplements: string[];
}

export interface ProgressionGuide {
  weeklyIncrease: number;
  deloadFrequency: number;
  deloadProtocol: string;
  progressionMethod: string;
  milestones: string[];
}

export interface QuestionnaireInputs {
  age: number;
  gender: Gender;
  weight: number;
  height: number;
  experienceLevel: ExperienceLevel;
  trainingYears: number;
  goal: Goal;
  targetWeight?: number;
  trainingDays: number;
  sessionDuration: number;
  equipment: Equipment[];
  hasGym: boolean;
  injuries: string[];
  currentLifts: {
    squat?: number;
    benchPress?: number;
    deadlift?: number;
    overheadPress?: number;
    bentOverRow?: number;
  };
  activityLevel: ActivityLevel;
  sleepHours: number;
  stressLevel: number;
  dietaryRestrictions: string[];
  mealsPerDay: number;
  weakPoints: MuscleGroup[];
  includeCardio: boolean;
  cardioPreference?: 'hiit' | 'liss' | 'none';
}

export interface GeneratedPlan {
  id: string;
  name: string;
  createdAt: string;
  inputs: QuestionnaireInputs;
  weeklyPlan: WeeklyPlan;
  nutrition: NutritionPlan;
  progression: ProgressionGuide;
  deloadWeek: WeeklyPlan;
}

export interface ExerciseLog {
  exerciseId: string;
  sets: SetLog[];
}

export interface SetLog {
  setNumber: number;
  reps: number;
  weight: number;
  completed: boolean;
  rpe?: number;
}

export interface WorkoutSession {
  id: string;
  planId: string;
  date: string;
  dayIndex: number;
  dayName: string;
  exercises: ExerciseLog[];
  notes?: string;
  duration?: number;
}

export interface CheckInData {
  planId: string;
  weekNumber: number;
  hitsTargets: boolean;
  notes?: string;
}

export interface OneRMResult {
  weight: number;
  reps: number;
  formula: 'epley' | 'brzycki' | 'lander';
  result: number;
}
