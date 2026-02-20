'use client';
import { Slider } from '@/components/ui/Slider';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';
import { EXPERIENCE_LEVELS } from '@/lib/constants';

export function Step02_Experience() {
  const { step, inputs, updateInputs, nextStep, prevStep } = useQuestionnaireStore();
  return (
    <StepWrapper step={step} title="Trainingserfahrung." onNext={nextStep} onBack={prevStep}>
      <div className="space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-mono text-[#8080a8] uppercase tracking-wider">Erfahrungsstufe</p>
          <div className="grid grid-cols-3 gap-3">
            {EXPERIENCE_LEVELS.map((lvl) => (
              <button
                key={lvl.value}
                onClick={() => updateInputs({ experienceLevel: lvl.value as 'beginner' | 'intermediate' | 'advanced' })}
                className={`p-4 rounded-xl border text-left transition-all font-mono ${
                  inputs.experienceLevel === lvl.value
                    ? 'border-[#6366f1] bg-[rgba(99,102,241,0.1)] text-[#818cf8]'
                    : 'border-[#2d2b55] bg-[#13132a] text-[#8080a8] hover:border-[#6366f1]'
                }`}
              >
                <div className="font-bold text-sm uppercase tracking-wider">{lvl.label}</div>
                <div className="text-xs mt-1 opacity-70">{lvl.description}</div>
              </button>
            ))}
          </div>
        </div>
        <Slider value={inputs.trainingYears} min={0} max={20} step={0.5}
          onChange={(v) => updateInputs({ trainingYears: v })}
          label="Jahre Training" unit=" J." />
      </div>
    </StepWrapper>
  );
}
