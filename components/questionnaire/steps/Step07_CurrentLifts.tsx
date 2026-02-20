'use client';
import { Input } from '@/components/ui/Input';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';

export function Step07_CurrentLifts() {
  const { step, inputs, updateInputs, nextStep, prevStep } = useQuestionnaireStore();

  function update(key: string, val: string) {
    const n = Number(val);
    updateInputs({ currentLifts: { ...inputs.currentLifts, [key]: isNaN(n) || val === '' ? undefined : n } });
  }

  const fields = [
    { key: 'benchPress', label: 'Bench Press' },
    { key: 'squat', label: 'Back Squat' },
    { key: 'deadlift', label: 'Deadlift' },
    { key: 'overheadPress', label: 'Overhead Press' },
    { key: 'bentOverRow', label: 'Bent-Over Row' },
  ];

  return (
    <StepWrapper step={step} title="Current lifting numbers." subtitle="Leave blank if you don't know. These allow us to prescribe precise training weights."
      onNext={nextStep} onBack={prevStep}>
      <div className="grid grid-cols-1 gap-4">
        {fields.map((f) => (
          <Input key={f.key} id={f.key} label={f.label} unit="kg" type="number"
            placeholder="e.g. 100"
            value={inputs.currentLifts[f.key as keyof typeof inputs.currentLifts] ?? ''}
            onChange={(e) => update(f.key, e.target.value)} />
        ))}
      </div>
      <p className="text-xs font-mono text-[#555] mt-2">These are your working-weight estimates — training weights will be set at ~75% of these values.</p>
    </StepWrapper>
  );
}
