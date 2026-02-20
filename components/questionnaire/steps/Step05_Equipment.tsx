'use client';
import { Tag } from '@/components/ui/Tag';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';
import { EQUIPMENT_OPTIONS } from '@/lib/constants';

export function Step05_Equipment() {
  const { step, inputs, updateInputs, nextStep, prevStep } = useQuestionnaireStore();

  function toggle(val: string) {
    const typed = val as import('@/types').Equipment;
    const eq = inputs.equipment.includes(typed)
      ? inputs.equipment.filter((e) => e !== typed)
      : [...inputs.equipment, typed];
    updateInputs({ equipment: eq });
  }

  return (
    <StepWrapper step={step} title="Verfügbare Ausrüstung." subtitle="Wähle alles aus, worauf du regelmäßig Zugriff hast."
      onNext={nextStep} onBack={prevStep} nextDisabled={inputs.equipment.length === 0}>
      <div className="flex flex-wrap gap-3">
        {EQUIPMENT_OPTIONS.map((e) => (
          <Tag key={e.value} label={e.label}
            selected={inputs.equipment.includes(e.value)}
            onClick={() => toggle(e.value)} />
        ))}
      </div>
      <p className="text-xs font-mono text-[#4040a0]">
        {inputs.equipment.length} ausgewählt
      </p>
    </StepWrapper>
  );
}
