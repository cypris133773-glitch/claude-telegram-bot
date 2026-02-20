'use client';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';
import { CARDIO_OPTIONS } from '@/lib/constants';

export function Step11_Cardio() {
  const { step, inputs, updateInputs, nextStep, prevStep } = useQuestionnaireStore();
  return (
    <StepWrapper step={step} title="Cardio & conditioning." onNext={nextStep} onBack={prevStep}>
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-mono text-[#888] uppercase tracking-wider">Include Cardio?</p>
          <div className="flex gap-4">
            {[{label:'Yes', val: true},{label:'No', val: false}].map((o) => (
              <button key={String(o.val)} onClick={() => updateInputs({ includeCardio: o.val })}
                className={`px-8 py-3 rounded-xl border font-mono font-bold text-sm uppercase tracking-wider transition-all ${
                  inputs.includeCardio === o.val
                    ? 'border-[#d4ff00] bg-[rgba(212,255,0,0.1)] text-[#d4ff00]'
                    : 'border-[#2a2a35] bg-[#0f0f12] text-[#888] hover:border-[#444]'
                }`}>{o.label}</button>
            ))}
          </div>
        </div>
        {inputs.includeCardio && (
          <div className="space-y-3">
            <p className="text-xs font-mono text-[#888] uppercase tracking-wider">Cardio Style</p>
            <div className="grid gap-3">
              {CARDIO_OPTIONS.map((c) => (
                <button key={c.value} onClick={() => updateInputs({ cardioPreference: c.value as 'hiit' | 'liss' | 'none' })}
                  className={`p-4 rounded-xl border text-left font-mono transition-all ${
                    inputs.cardioPreference === c.value
                      ? 'border-[#d4ff00] bg-[rgba(212,255,0,0.08)] text-[#d4ff00]'
                      : 'border-[#2a2a35] bg-[#0f0f12] text-[#888] hover:border-[#444]'
                  }`}>
                  <div className="font-bold text-sm">{c.label}</div>
                  <div className="text-xs mt-0.5 opacity-70">{c.description}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </StepWrapper>
  );
}
