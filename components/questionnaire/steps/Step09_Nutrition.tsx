'use client';
import { Slider } from '@/components/ui/Slider';
import { Tag } from '@/components/ui/Tag';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';
import { DIETARY_RESTRICTIONS } from '@/lib/constants';

export function Step09_Nutrition() {
  const { step, inputs, updateInputs, nextStep, prevStep } = useQuestionnaireStore();

  function toggle(val: string) {
    const arr = inputs.dietaryRestrictions.includes(val)
      ? inputs.dietaryRestrictions.filter((d) => d !== val)
      : [...inputs.dietaryRestrictions, val];
    updateInputs({ dietaryRestrictions: arr });
  }

  return (
    <StepWrapper step={step} title="Ernährungspräferenzen." onNext={nextStep} onBack={prevStep}>
      <div className="space-y-8">
        <Slider value={inputs.mealsPerDay} min={2} max={7}
          onChange={(v) => updateInputs({ mealsPerDay: v })} label="Mahlzeiten pro Tag" unit=" Mzl." />
        <div className="space-y-3">
          <p className="text-xs font-mono text-[#8080a8] uppercase tracking-wider">Ernährungseinschränkungen</p>
          <div className="flex flex-wrap gap-3">
            {DIETARY_RESTRICTIONS.map((d) => (
              <Tag key={d.value} label={d.label}
                selected={inputs.dietaryRestrictions.includes(d.value)}
                onClick={() => toggle(d.value)} />
            ))}
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
