'use client';
import { Slider } from '@/components/ui/Slider';
import { Tag } from '@/components/ui/Tag';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';

export function Step01_Basics() {
  const { step, inputs, updateInputs, nextStep } = useQuestionnaireStore();
  return (
    <StepWrapper
      step={step}
      title="Let's start with the basics."
      subtitle="Your physiology forms the foundation of your personalised plan."
      onNext={nextStep}
    >
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-xs font-mono text-[#888] uppercase tracking-wider">Gender</p>
            <div className="flex gap-3">
              {(['male','female'] as const).map((g) => (
                <Tag key={g} label={g.charAt(0).toUpperCase() + g.slice(1)}
                  selected={inputs.gender === g}
                  onClick={() => updateInputs({ gender: g })} />
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-mono text-[#888] uppercase tracking-wider">Age</p>
            <Slider value={inputs.age} min={16} max={70} onChange={(v) => updateInputs({ age: v })} unit=" yrs" />
          </div>
        </div>
        <Slider value={inputs.weight} min={40} max={200} onChange={(v) => updateInputs({ weight: v })} label="Body Weight" unit=" kg" />
        <Slider value={inputs.height} min={140} max={220} onChange={(v) => updateInputs({ height: v })} label="Height" unit=" cm" />
      </div>
    </StepWrapper>
  );
}
