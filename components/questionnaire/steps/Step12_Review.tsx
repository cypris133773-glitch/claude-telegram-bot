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
    <StepWrapper step={step} title="Überprüfe deine Angaben." subtitle="Alles korrekt? Du kannst zurückgehen und Anpassungen vornehmen."
      onNext={nextStep} onBack={prevStep} nextLabel="MEINEN PLAN ERSTELLEN →">
      <div className="bg-[#0f0f12] border border-[#2a2a35] rounded-xl p-5 space-y-1">
        <Row label="Alter / Geschlecht" value={`${inputs.age} J. · ${inputs.gender}`} />
        <Row label="Körpergewicht" value={`${inputs.weight} kg`} />
        <Row label="Größe" value={`${inputs.height} cm`} />
        <Row label="Erfahrung" value={inputs.experienceLevel} />
        <Row label="Ziel" value={inputs.goal} />
        <Row label="Trainingstage" value={`${inputs.trainingDays}×/Woche · ${inputs.sessionDuration} Min.`} />
        <Row label="Ausrüstung" value={inputs.equipment.join(', ')} />
        <Row label="Verletzungen" value={inputs.injuries.length ? inputs.injuries.join(', ') : 'Keine'} />
        <Row label="Aktivität" value={inputs.activityLevel} />
        <Row label="Schlaf" value={`${inputs.sleepHours} Std.`} />
        <Row label="Mahlzeiten/Tag" value={String(inputs.mealsPerDay)} />
        <Row label="Cardio" value={inputs.includeCardio ? (inputs.cardioPreference ?? 'keine') : 'Nein'} />
        <Row label="Schwachpunkte" value={inputs.weakPoints.length ? inputs.weakPoints.join(', ') : 'Keine'} />
      </div>
    </StepWrapper>
  );
}
