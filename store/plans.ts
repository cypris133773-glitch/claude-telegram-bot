import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GeneratedPlan } from '@/types';

interface PlansState {
  plans: GeneratedPlan[];
  activePlanId: string | null;
  addPlan: (plan: GeneratedPlan) => void;
  removePlan: (id: string) => void;
  setActivePlan: (id: string) => void;
  getActivePlan: () => GeneratedPlan | null;
  updatePlanName: (id: string, name: string) => void;
}

export const usePlansStore = create<PlansState>()(
  persist(
    (set, get) => ({
      plans: [],
      activePlanId: null,

      addPlan: (plan) =>
        set((s) => ({
          plans: [plan, ...s.plans],
          activePlanId: plan.id,
        })),

      removePlan: (id) =>
        set((s) => {
          const filtered = s.plans.filter((p) => p.id !== id);
          return {
            plans: filtered,
            activePlanId: s.activePlanId === id
              ? (filtered[0]?.id ?? null)
              : s.activePlanId,
          };
        }),

      setActivePlan: (id) => set({ activePlanId: id }),

      getActivePlan: () => {
        const { plans, activePlanId } = get();
        return plans.find((p) => p.id === activePlanId) ?? plans[0] ?? null;
      },

      updatePlanName: (id, name) =>
        set((s) => ({
          plans: s.plans.map((p) => (p.id === id ? { ...p, name } : p)),
        })),
    }),
    { name: 'fitgen-plans-v1' }
  )
);
