'use client';
import { Slider } from '@/components/ui/Slider';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';
import { ACTIVITY_LEVELS } from '@/lib/constants';

export function Step08_Activity() {
  const { step, inputs, updateInputs, nextStep, prevStep } = useQuestionnaireStore();
  return (
    <StepWrapper step={step} title="Tägliche Aktivität & Erholung." onNext={nextStep} onBack={prevStep}>
      <div className="space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-mono text-[#888] uppercase tracking-wider">Aktivitätslevel außerhalb des Gyms</p>
          <div className="space-y-3">
            {ACTIVITY_LEVELS.map((a) => (
              <button key={a.value} onClick={() => updateInputs({ activityLevel: a.value as 'sedentary' | 'moderate' | 'active' })}
                className={`w-full p-4 rounded-xl border text-left font-mono transition-all ${
                  inputs.activityLevel === a.value
                    ? 'border-[#d4ff00] bg-[rgba(212,255,0,0.08)] text-[#d4ff00]'
                    : 'border-[#2a2a35] bg-[#0f0f12] text-[#888] hover:border-[#444]'
                }`}>
                <div className="font-bold text-sm">{a.label}</div>
                <div className="text-xs mt-0.5 opacity-70">{a.description}</div>
              </button>
            ))}
          </div>
        </div>
        <Slider value={inputs.sleepHours} min={4} max={12} step={0.5}
          onChange={(v) => updateInputs({ sleepHours: v })} label="Durchschn. Schlaf" unit=" Std." />
        <div className="space-y-3">
          <p className="text-xs font-mono text-[#888] uppercase tracking-wider">
            Stresslevel (1 = keiner, 5 = hoch)
          </p>
          <div className="flex gap-3">
            {[1,2,3,4,5].map((n) => (
              <button key={n} onClick={() => updateInputs({ stressLevel: n as 1|2|3|4|5 })}
                className={`w-12 h-12 rounded-xl border font-mono font-bold transition-all ${
                  inputs.stressLevel === n
                    ? 'border-[#d4ff00] bg-[rgba(212,255,0,0.1)] text-[#d4ff00]'
                    : 'border-[#2a2a35] bg-[#0f0f12] text-[#888] hover:border-[#444]'
                }`}>{n}</button>
            ))}
          </div>
        </div>
      </div>
    </StepWrapper>
  );
}
