'use client';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';
import { GOALS } from '@/lib/constants';
import type { Goal } from '@/types';

export function Step01_Goal() {
  const { step, inputs, updateInputs, nextStep } = useQuestionnaireStore();

  return (
    <StepWrapper
      step={step}
      title="Dein Ziel"
      subtitle="Was möchtest du erreichen?"
      onNext={nextStep}
      nextDisabled={!inputs.goal}
      hideProgress
    >
      <div className="grid grid-cols-1 gap-3">
        {GOALS.map((g) => {
          const selected = inputs.goal === g.value;
          return (
            <button
              key={g.value}
              onClick={() => updateInputs({ goal: g.value as Goal })}
              className={`w-full text-left px-5 py-4 rounded-2xl border font-mono transition-all duration-200 ${
                selected
                  ? 'bg-gradient-to-r from-[rgba(99,102,241,0.2)] to-[rgba(192,132,252,0.15)] border-[#6366f1] shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                  : 'bg-[#0d0d1f] border-[#1e1b4b] hover:border-[#4040a0]'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{g.icon}</span>
                <div>
                  <p className={`font-bold text-base ${selected ? 'text-white' : 'text-[#c8c8e8]'}`}>
                    {g.label}
                  </p>
                  <p className="text-xs text-[#6060a0] mt-0.5">{g.description}</p>
                </div>
                {selected && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-[#6366f1] flex items-center justify-center">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </StepWrapper>
  );
}
