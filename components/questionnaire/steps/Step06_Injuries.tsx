'use client';
import { Tag } from '@/components/ui/Tag';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';
import { INJURY_OPTIONS } from '@/lib/constants';

export function Step06_Injuries() {
  const { step, inputs, updateInputs, nextStep, prevStep } = useQuestionnaireStore();

  function toggle(val: string) {
    const arr = inputs.injuries.includes(val)
      ? inputs.injuries.filter((i) => i !== val)
      : [...inputs.injuries, val];
    updateInputs({ injuries: arr });
  }

  return (
    <StepWrapper step={step} title="Injuries or pain areas." subtitle="We'll exclude exercises that could aggravate these. Select none if you're healthy."
      onNext={nextStep} onBack={prevStep}>
      <div className="flex flex-wrap gap-3">
        {INJURY_OPTIONS.map((inj) => (
          <Tag key={inj.value} label={inj.label}
            selected={inputs.injuries.includes(inj.value)}
            onClick={() => toggle(inj.value)} />
        ))}
      </div>
    </StepWrapper>
  );
}
