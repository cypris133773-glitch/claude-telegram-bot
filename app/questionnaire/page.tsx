'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { usePlansStore } from '@/store/plans';
import { buildPlan } from '@/lib/plan-builder';

import { Step01_Basics } from '@/components/questionnaire/steps/Step01_Basics';
import { Step02_Experience } from '@/components/questionnaire/steps/Step02_Experience';
import { Step03_Goal } from '@/components/questionnaire/steps/Step03_Goal';
import { Step04_Schedule } from '@/components/questionnaire/steps/Step04_Schedule';
import { Step05_Equipment } from '@/components/questionnaire/steps/Step05_Equipment';
import { Step06_Injuries } from '@/components/questionnaire/steps/Step06_Injuries';
import { Step07_CurrentLifts } from '@/components/questionnaire/steps/Step07_CurrentLifts';
import { Step08_Activity } from '@/components/questionnaire/steps/Step08_Activity';
import { Step09_Nutrition } from '@/components/questionnaire/steps/Step09_Nutrition';
import { Step10_WeakPoints } from '@/components/questionnaire/steps/Step10_WeakPoints';
import { Step11_Cardio } from '@/components/questionnaire/steps/Step11_Cardio';
import { Step12_Review } from '@/components/questionnaire/steps/Step12_Review';

const STEPS = [
  Step01_Basics,
  Step02_Experience,
  Step03_Goal,
  Step04_Schedule,
  Step05_Equipment,
  Step06_Injuries,
  Step07_CurrentLifts,
  Step08_Activity,
  Step09_Nutrition,
  Step10_WeakPoints,
  Step11_Cardio,
  Step12_Review,
];

export default function QuestionnairePage() {
  const { step, inputs, setPlan } = useQuestionnaireStore();
  const { addPlan } = usePlansStore();
  const router = useRouter();

  useEffect(() => {
    if (step > STEPS.length) {
      const plan = buildPlan(inputs);
      setPlan(plan);
      addPlan(plan);
      router.push('/plan');
    }
  }, [step, inputs, setPlan, addPlan, router]);

  const idx = Math.min(step - 1, STEPS.length - 1);
  const CurrentStep = STEPS[idx];

  return (
    <AnimatePresence mode="wait">
      <CurrentStep key={step} />
    </AnimatePresence>
  );
}
