'use client';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';
import { SPLIT_LABELS } from '@/lib/constants';

const TICKS = [2, 3, 4, 5, 6];

export function Step04_Schedule() {
  const { step, inputs, updateInputs, nextStep, prevStep } = useQuestionnaireStore();
  const split = SPLIT_LABELS[inputs.trainingDays as keyof typeof SPLIT_LABELS] ?? 'Benutzerdefinierter Split';

  return (
    <StepWrapper
      step={step}
      title="Trainingstage"
      subtitle="Wie oft pro Woche kannst du trainieren?"
      onNext={nextStep}
      onBack={prevStep}
    >
      <div className="space-y-8">
        {/* Big gradient number */}
        <div className="flex flex-col items-center py-4">
          <span className="text-8xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] to-[#c084fc] leading-none select-none">
            {inputs.trainingDays}
          </span>
          <span className="text-[#8080a8] font-mono text-sm mt-2">Tage pro Woche</span>
        </div>

        {/* Tick slider */}
        <div className="space-y-3">
          <input
            type="range"
            min={2}
            max={6}
            step={1}
            value={inputs.trainingDays}
            onChange={(e) => updateInputs({ trainingDays: Number(e.target.value) })}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #c084fc ${((inputs.trainingDays - 2) / 4) * 100}%, #1e1b4b ${((inputs.trainingDays - 2) / 4) * 100}%, #1e1b4b 100%)`,
            }}
          />
          <div className="flex justify-between px-1">
            {TICKS.map((t) => (
              <button
                key={t}
                onClick={() => updateInputs({ trainingDays: t })}
                className={`text-xs font-mono transition-colors ${
                  inputs.trainingDays === t ? 'text-[#c084fc] font-bold' : 'text-[#4040a0]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Split recommendation */}
        <div className="bg-[#0d0d20] border border-[#2d2b55] rounded-xl p-4">
          <p className="text-xs font-mono text-[#6060a0] uppercase tracking-wider mb-1">Empfohlener Split</p>
          <p className="text-[#818cf8] font-mono font-bold">{split}</p>
        </div>
      </div>
    </StepWrapper>
  );
}
