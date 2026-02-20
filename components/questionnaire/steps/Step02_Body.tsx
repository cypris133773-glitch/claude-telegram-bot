'use client';
import { Slider } from '@/components/ui/Slider';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';
import type { Gender } from '@/types';

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'male',   label: 'Männlich' },
  { value: 'female', label: 'Weiblich' },
];

export function Step02_Body() {
  const { step, inputs, updateInputs, nextStep, prevStep } = useQuestionnaireStore();

  return (
    <StepWrapper
      step={step}
      title="Deine Körperdaten"
      subtitle="Stelle deine Werte mit den Reglern ein."
      onNext={nextStep}
      onBack={prevStep}
      backLabel="← Abbrechen"
    >
      <div className="space-y-8">
        {/* Gender */}
        <div className="space-y-3">
          <p className="text-xs font-mono text-[#8080a8] uppercase tracking-wider">Geschlecht</p>
          <div className="flex gap-3">
            {GENDERS.map((g) => {
              const selected = inputs.gender === g.value;
              return (
                <button
                  key={g.value}
                  onClick={() => updateInputs({ gender: g.value })}
                  className={`flex-1 py-3 px-4 rounded-xl border font-mono text-sm font-bold transition-all duration-200 ${
                    selected
                      ? 'bg-gradient-to-r from-[rgba(99,102,241,0.2)] to-[rgba(192,132,252,0.15)] border-[#6366f1] text-white shadow-[0_0_16px_rgba(99,102,241,0.2)]'
                      : 'bg-[#0d0d1f] border-[#1e1b4b] text-[#8080a8] hover:border-[#4040a0]'
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sliders */}
        <Slider
          value={inputs.height}
          min={140}
          max={220}
          onChange={(v) => updateInputs({ height: v })}
          label="Größe"
          unit=" cm"
        />
        <Slider
          value={inputs.weight}
          min={40}
          max={200}
          onChange={(v) => updateInputs({ weight: v })}
          label="Gewicht"
          unit=" kg"
        />
        <Slider
          value={inputs.age}
          min={16}
          max={70}
          onChange={(v) => updateInputs({ age: v })}
          label="Alter"
          unit=" J."
        />
      </div>
    </StepWrapper>
  );
}
