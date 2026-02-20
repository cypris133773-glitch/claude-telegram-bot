'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { usePlansStore } from '@/store/plans';
import { buildPlan } from '@/lib/plan-builder';

import { Step01_Goal } from '@/components/questionnaire/steps/Step01_Goal';
import { Step02_Body } from '@/components/questionnaire/steps/Step02_Body';
import { Step03_Level } from '@/components/questionnaire/steps/Step03_Level';
import { Step04_Schedule } from '@/components/questionnaire/steps/Step04_Schedule';
import { Step05_Equipment } from '@/components/questionnaire/steps/Step05_Equipment';

const STEPS = [
  Step01_Goal,
  Step02_Body,
  Step03_Level,
  Step04_Schedule,
  Step05_Equipment,
];

export default function QuestionnairePage() {
  const { step, inputs, setPlan, reset } = useQuestionnaireStore();
  const { addPlan } = usePlansStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (step < 1 || step > 6) {
      reset();
      return;
    }
    if (step > STEPS.length) {
      const plan = buildPlan(inputs);
      setPlan(plan);
      addPlan(plan);
      reset();
      router.push('/plan');
    }
  }, [mounted, step, inputs, setPlan, addPlan, reset, router]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#06061a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const idx = Math.min(step - 1, STEPS.length - 1);
  const CurrentStep = STEPS[idx];

  return (
    <AnimatePresence mode="wait">
      <CurrentStep key={step} />
    </AnimatePresence>
  );
}
