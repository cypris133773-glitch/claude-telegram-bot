'use client';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';
import { CARDIO_OPTIONS } from '@/lib/constants';

export function Step11_Cardio() {
  const { step, inputs, updateInputs, nextStep, prevStep } = useQuestionnaireStore();
  return (
    <StepWrapper step={step} title="Cardio & Konditionierung." onNext={nextStep} onBack={prevStep}>
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-mono text-[#8080a8] uppercase tracking-wider">Cardio einbeziehen?</p>
          <div className="flex gap-4">
            {[{label:'Ja', val: true},{label:'Nein', val: false}].map((o) => (
              <button key={String(o.val)} onClick={() => updateInputs({ includeCardio: o.val })}
                className={`px-8 py-3 rounded-xl border font-mono font-bold text-sm uppercase tracking-wider transition-all ${
                  inputs.includeCardio === o.val
                    ? 'border-[#6366f1] bg-[rgba(99,102,241,0.1)] text-[#818cf8]'
                    : 'border-[#2d2b55] bg-[#13132a] text-[#8080a8] hover:border-[#6366f1]'
                }`}>{o.label}</button>
            ))}
          </div>
        </div>
        {inputs.includeCardio && (
          <div className="space-y-3">
            <p className="text-xs font-mono text-[#8080a8] uppercase tracking-wider">Cardio-Stil</p>
            <div className="grid gap-3">
              {CARDIO_OPTIONS.map((c) => (
                <button key={c.value} onClick={() => updateInputs({ cardioPreference: c.value as 'hiit' | 'liss' | 'none' })}
                  className={`p-4 rounded-xl border text-left font-mono transition-all ${
                    inputs.cardioPreference === c.value
                      ? 'border-[#6366f1] bg-[rgba(99,102,241,0.1)] text-[#818cf8]'
                      : 'border-[#2d2b55] bg-[#13132a] text-[#8080a8] hover:border-[#6366f1]'
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
