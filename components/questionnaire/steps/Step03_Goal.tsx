'use client';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';
import { GOALS } from '@/lib/constants';

export function Step03_Goal() {
  const { step, inputs, updateInputs, nextStep, prevStep } = useQuestionnaireStore();
  return (
    <StepWrapper step={step} title="Was ist dein Hauptziel?" onNext={nextStep} onBack={prevStep}>
      <div className="grid grid-cols-1 gap-4">
        {GOALS.map((g) => (
          <button
            key={g.value}
            onClick={() => updateInputs({ goal: g.value as 'strength' | 'hypertrophy' | 'definition' | 'recomp' })}
            className={`p-5 rounded-xl border text-left transition-all font-mono flex items-center gap-4 ${
              inputs.goal === g.value
                ? 'border-[#6366f1] bg-[rgba(99,102,241,0.1)]'
                : 'border-[#2d2b55] bg-[#13132a] hover:border-[#6366f1]'
            }`}
          >
            <span className="text-3xl">{g.icon}</span>
            <div>
              <div className={`font-bold text-base uppercase tracking-wider ${inputs.goal === g.value ? 'text-[#818cf8]' : 'text-white'}`}>
                {g.label}
              </div>
              <div className="text-xs text-[#8080a8] mt-1">{g.description}</div>
            </div>
          </button>
        ))}
      </div>
    </StepWrapper>
  );
}
