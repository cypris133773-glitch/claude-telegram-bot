'use client';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { StepWrapper } from '@/components/questionnaire/StepWrapper';

interface RowProps { label: string; value: string }
function Row({ label, value }: RowProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-[#17171c] last:border-0">
      <span className="text-xs font-mono text-[#888] uppercase tracking-wider">{label}</span>
      <span className="text-sm font-mono text-[#e8e8e8] font-medium">{value}</span>
    </div>
  );
}

export function Step12_Review() {
  const { step, inputs, nextStep, prevStep } = useQuestionnaireStore();
  return (
    <StepWrapper step={step} title="Review your inputs." subtitle="Everything look correct? You can go back to adjust."
      onNext={nextStep} onBack={prevStep} nextLabel="GENERATE MY PLAN →">
      <div className="bg-[#0f0f12] border border-[#2a2a35] rounded-xl p-5 space-y-1">
        <Row label="Age / Gender" value={`${inputs.age} yrs · ${inputs.gender}`} />
        <Row label="Body Weight" value={`${inputs.weight} kg`} />
        <Row label="Height" value={`${inputs.height} cm`} />
        <Row label="Experience" value={inputs.experienceLevel} />
        <Row label="Goal" value={inputs.goal} />
        <Row label="Training Days" value={`${inputs.trainingDays}×/week · ${inputs.sessionDuration} min`} />
        <Row label="Equipment" value={inputs.equipment.join(', ')} />
        <Row label="Injuries" value={inputs.injuries.length ? inputs.injuries.join(', ') : 'None'} />
        <Row label="Activity" value={inputs.activityLevel} />
        <Row label="Sleep" value={`${inputs.sleepHours} hrs`} />
        <Row label="Meals/Day" value={String(inputs.mealsPerDay)} />
        <Row label="Cardio" value={inputs.includeCardio ? (inputs.cardioPreference ?? 'none') : 'No'} />
        <Row label="Weak Points" value={inputs.weakPoints.length ? inputs.weakPoints.join(', ') : 'None'} />
      </div>
    </StepWrapper>
  );
}
