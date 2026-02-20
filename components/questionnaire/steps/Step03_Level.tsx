'use client';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';
import { EXPERIENCE_LEVELS } from '@/lib/constants';
import type { ExperienceLevel } from '@/types';

export function Step03_Level() {
  const { step, inputs, updateInputs, nextStep, prevStep } = useQuestionnaireStore();

  return (
    <StepWrapper
      step={step}
      title="Dein Level"
      subtitle="Wie lange trainierst du schon?"
      onNext={nextStep}
      onBack={prevStep}
      nextDisabled={!inputs.experienceLevel}
    >
      <div className="flex flex-col gap-3">
        {EXPERIENCE_LEVELS.map((lvl) => {
          const selected = inputs.experienceLevel === lvl.value;
          return (
            <button
              key={lvl.value}
              onClick={() => updateInputs({ experienceLevel: lvl.value as ExperienceLevel })}
              className={`w-full text-left px-5 py-5 rounded-2xl border font-mono transition-all duration-200 ${
                selected
                  ? 'bg-gradient-to-r from-[rgba(99,102,241,0.2)] to-[rgba(192,132,252,0.15)] border-[#6366f1] shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                  : 'bg-[#0d0d1f] border-[#1e1b4b] hover:border-[#4040a0]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-bold text-lg ${selected ? 'text-white' : 'text-[#c8c8e8]'}`}>
                    {lvl.label}
                  </p>
                  <p className="text-sm text-[#6060a0] mt-0.5">{lvl.description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected ? 'border-[#6366f1] bg-[#6366f1]' : 'border-[#3030608]'
                }`}>
                  {selected && (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </StepWrapper>
  );
}
