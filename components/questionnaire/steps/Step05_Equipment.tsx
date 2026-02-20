'use client';
import { Tag } from '@/components/ui/Tag';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';
import { EQUIPMENT_OPTIONS } from '@/lib/constants';
import type { Equipment } from '@/types';

export function Step05_Equipment() {
  const { step, inputs, updateInputs, nextStep, prevStep } = useQuestionnaireStore();

  function toggle(val: Equipment) {
    const eq = inputs.equipment.includes(val)
      ? inputs.equipment.filter((e) => e !== val)
      : [...inputs.equipment, val];
    updateInputs({ equipment: eq });
  }

  return (
    <StepWrapper
      step={step}
      title="Dein Equipment"
      subtitle="Was steht dir zur Verfügung?"
      onNext={nextStep}
      onBack={prevStep}
      nextLabel="PLAN ERSTELLEN →"
      nextDisabled={inputs.equipment.length === 0}
    >
      <div className="flex flex-wrap gap-3">
        {EQUIPMENT_OPTIONS.map((e) => (
          <Tag
            key={e.value}
            label={e.label}
            selected={inputs.equipment.includes(e.value)}
            onClick={() => toggle(e.value)}
          />
        ))}
      </div>
      {inputs.equipment.length > 0 && (
        <p className="text-xs font-mono text-[#6060a0]">
          {inputs.equipment.length} ausgewählt
        </p>
      )}
    </StepWrapper>
  );
}
