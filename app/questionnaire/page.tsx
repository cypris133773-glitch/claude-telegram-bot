'use client';
import { useEffect } from 'react';
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

  useEffect(() => {
    if (step < 1 || step > 6) {
      reset();
      return;
    }
    if (step > STEPS.length) {
      const plan = buildPlan(inputs);
      setPlan(plan);
      addPlan(plan);
      router.push('/plan');
    }
  }, [step, inputs, setPlan, addPlan, reset, router]);

  const idx = Math.min(step - 1, STEPS.length - 1);
  const CurrentStep = STEPS[idx];

  return (
    <AnimatePresence mode="wait">
      <CurrentStep key={step} />
    </AnimatePresence>
  );
}
