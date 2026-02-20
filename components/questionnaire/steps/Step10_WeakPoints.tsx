'use client';
import { Tag } from '@/components/ui/Tag';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';
import { MUSCLE_GROUPS } from '@/lib/constants';

export function Step10_WeakPoints() {
  const { step, inputs, updateInputs, nextStep, prevStep } = useQuestionnaireStore();

  function toggle(val: string) {
    const typed = val as import('@/types').MuscleGroup;
    const arr = inputs.weakPoints.includes(typed)
      ? inputs.weakPoints.filter((w) => w !== typed)
      : [...inputs.weakPoints, typed];
    updateInputs({ weakPoints: arr });
  }

  return (
    <StepWrapper step={step} title="Schwachpunkte priorisieren." subtitle="Wir fügen diesen Muskelgruppen zusätzliches Volumen hinzu."
      onNext={nextStep} onBack={prevStep}>
      <div className="flex flex-wrap gap-3">
        {MUSCLE_GROUPS.map((m) => (
          <Tag key={m.value} label={m.label}
            selected={(inputs.weakPoints as string[]).includes(m.value)}
            onClick={() => toggle(m.value)} />
        ))}
      </div>
    </StepWrapper>
  );
}
