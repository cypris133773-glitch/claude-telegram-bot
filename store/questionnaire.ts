import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuestionnaireInputs, GeneratedPlan } from '@/types';

const DEFAULT_INPUTS: QuestionnaireInputs = {
  age: 25,
  gender: 'male',
  weight: 80,
  height: 178,
  experienceLevel: 'intermediate',
  trainingYears: 2,
  goal: 'hypertrophy',
  trainingDays: 4,
  sessionDuration: 60,
  equipment: ['barbell', 'dumbbell', 'cable', 'machine'],
  hasGym: true,
  injuries: [],
  currentLifts: {},
  activityLevel: 'moderate',
  sleepHours: 7,
  stressLevel: 3,
  dietaryRestrictions: [],
  mealsPerDay: 4,
  weakPoints: [],
  includeCardio: false,
  cardioPreference: 'none',
};

interface QuestionnaireState {
  step: number;
  inputs: QuestionnaireInputs;
  plan: GeneratedPlan | null;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateInputs: (partial: Partial<QuestionnaireInputs>) => void;
  setPlan: (plan: GeneratedPlan) => void;
  reset: () => void;
}

export const useQuestionnaireStore = create<QuestionnaireState>()(
  persist(
    (set) => ({
      step: 1,
      inputs: DEFAULT_INPUTS,
      plan: null,
      setStep: (step) => set({ step }),
      nextStep: () => set((s) => ({ step: Math.min(13, s.step + 1) })),
      prevStep: () => set((s) => ({ step: Math.max(1, s.step - 1) })),
      updateInputs: (partial) =>
        set((s) => ({ inputs: { ...s.inputs, ...partial } })),
      setPlan: (plan) => set({ plan }),
      reset: () => set({ step: 1, inputs: DEFAULT_INPUTS, plan: null }),
    }),
    { name: 'dnpt-questionnaire' }
  )
);
