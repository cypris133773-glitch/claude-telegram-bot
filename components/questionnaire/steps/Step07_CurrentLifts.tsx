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
    { key: 'benchPress', label: 'Bankdrücken' },
    { key: 'squat', label: 'Kniebeuge' },
    { key: 'deadlift', label: 'Kreuzheben' },
    { key: 'overheadPress', label: 'Schulterdrücken' },
    { key: 'bentOverRow', label: 'Vorgebeugtes Rudern' },
  ];

  return (
    <StepWrapper step={step} title="Aktuelle Hebeleistungen." subtitle="Leer lassen, wenn unbekannt. Diese ermöglichen uns, genaue Trainingsgewichte vorzuschreiben."
      onNext={nextStep} onBack={prevStep}>
      <div className="grid grid-cols-1 gap-4">
        {fields.map((f) => (
          <Input key={f.key} id={f.key} label={f.label} unit="kg" type="number"
            placeholder="z.B. 100"
            value={inputs.currentLifts[f.key as keyof typeof inputs.currentLifts] ?? ''}
            onChange={(e) => update(f.key, e.target.value)} />
        ))}
      </div>
      <p className="text-xs font-mono text-[#555] mt-2">Dies sind deine Arbeitsgewichtsschätzungen — Trainingsgewichte werden auf ~75% dieser Werte gesetzt.</p>
    </StepWrapper>
  );
}
