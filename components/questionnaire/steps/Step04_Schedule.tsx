'use client';
import { Slider } from '@/components/ui/Slider';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';
import { SPLIT_LABELS } from '@/lib/constants';

export function Step04_Schedule() {
  const { step, inputs, updateInputs, nextStep, prevStep } = useQuestionnaireStore();
  const split = SPLIT_LABELS[inputs.trainingDays as keyof typeof SPLIT_LABELS] ?? 'Custom Split';
  return (
    <StepWrapper step={step} title="Training schedule." onNext={nextStep} onBack={prevStep}>
      <div className="space-y-8">
        <div className="space-y-4">
          <Slider value={inputs.trainingDays} min={2} max={6}
            onChange={(v) => updateInputs({ trainingDays: v })}
            label="Training Days per Week" unit=" days" />
          <div className="bg-[#0f0f12] border border-[#2a2a35] rounded-xl p-4">
            <p className="text-xs font-mono text-[#888] uppercase tracking-wider mb-1">Optimal Split</p>
            <p className="text-[#d4ff00] font-mono font-bold">{split}</p>
          </div>
        </div>
        <Slider value={inputs.sessionDuration} min={30} max={120} step={5}
          onChange={(v) => updateInputs({ sessionDuration: v })}
          label="Session Duration" unit=" min" />
      </div>
    </StepWrapper>
  );
}
