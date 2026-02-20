'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { DayCard } from '@/components/plan/DayCard';
import { NutritionPanel } from '@/components/plan/NutritionPanel';
import { Button } from '@/components/ui/Button';
import type { GeneratedPlan } from '@/types';

type Tab = 'plan' | 'nutrition' | 'progression' | 'deload';

export default function PlanPage() {
  const { plan: storedPlan, reset } = useQuestionnaireStore();
  const router = useRouter();
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [tab, setTab] = useState<Tab>('plan');

  useEffect(() => {
    if (storedPlan) {
      setPlan(storedPlan);
    } else {
      router.push('/questionnaire');
    }
  }, [storedPlan, router]);

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#070709] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#d4ff00] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'plan', label: 'Training' },
    { key: 'nutrition', label: 'Ernährung' },
    { key: 'progression', label: 'Progression' },
    { key: 'deload', label: 'Deload' },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-[#e8e8e8]">
      {/* Hero */}
      <div className="border-b border-[#17171c] bg-[#0a0a0d]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-xs font-mono text-[#555] uppercase tracking-widest mb-2">DNA-gesteuertes Training</p>
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-[#e8e8e8] mb-1">{plan.name}</h1>
          <p className="text-sm font-mono text-[#888]">
            {plan.weeklyPlan.splitType} · {plan.weeklyPlan.days.length} Tage/Woche
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { label: 'Zielkalorien', value: `${plan.nutrition.targetCalories} kcal` },
              { label: 'Protein', value: `${plan.nutrition.macros.protein}g` },
              { label: 'Trainingstage', value: `${plan.weeklyPlan.days.length}/Wo.` },
              { label: 'Einheit', value: `${plan.inputs.sessionDuration} Min.` },
            ].map((s) => (
              <div key={s.label} className="bg-[#17171c] border border-[#2a2a35] rounded-xl px-4 py-3">
                <p className="text-xs font-mono text-[#555] uppercase tracking-wider">{s.label}</p>
                <p className="text-lg font-mono font-bold text-[#d4ff00] mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-[#070709]/95 backdrop-blur border-b border-[#17171c]">
        <div className="max-w-4xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3.5 text-sm font-mono font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                tab === t.key ? 'border-[#d4ff00] text-[#d4ff00]' : 'border-transparent text-[#555] hover:text-[#888]'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {tab === 'plan' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-mono font-bold text-[#e8e8e8]">Wochenplan</h2>
              <Button variant="outline" size="sm" onClick={() => { reset(); router.push('/questionnaire'); }}>
                Plan neu erstellen
              </Button>
            </div>
            {plan.weeklyPlan.days.map((day, i) => <DayCard key={i} day={day} />)}
          </div>
        )}

        {tab === 'nutrition' && (
          <div className="space-y-6">
            <h2 className="font-mono font-bold text-[#e8e8e8]">Ernährungsplan</h2>
            <NutritionPanel nutrition={plan.nutrition} />
          </div>
        )}

        {tab === 'progression' && (
          <div className="space-y-6">
            <h2 className="font-mono font-bold text-[#e8e8e8]">Progressionsleitfaden</h2>
            <div className="bg-[#0a0a0d] border border-[#2a2a35] rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-mono text-[#888] uppercase tracking-wider">Wöchentliche Steigerung</p>
                  <p className="text-2xl font-mono font-bold text-[#d4ff00] mt-1">+{plan.progression.weeklyIncrease}kg</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-[#888] uppercase tracking-wider">Deload alle</p>
                  <p className="text-2xl font-mono font-bold text-[#d4ff00] mt-1">{plan.progression.deloadFrequency} Wo.</p>
                </div>
              </div>
              <div className="border-t border-[#17171c] pt-5 space-y-4">
                <div>
                  <p className="text-xs font-mono text-[#d4ff00] uppercase tracking-wider mb-2">Methode</p>
                  <p className="text-sm font-mono text-[#888] leading-relaxed">{plan.progression.progressionMethod}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-[#d4ff00] uppercase tracking-wider mb-2">Deload-Protokoll</p>
                  <p className="text-sm font-mono text-[#888] leading-relaxed">{plan.progression.deloadProtocol}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-[#d4ff00] uppercase tracking-wider mb-2">Meilensteine</p>
                  <ul className="space-y-2">
                    {plan.progression.milestones.map((m, i) => (
                      <li key={i} className="text-sm font-mono text-[#888] flex gap-2">
                        <span className="text-[#d4ff00]">▸</span>{m}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'deload' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-mono font-bold text-[#e8e8e8]">Deload-Woche</h2>
              <p className="text-sm font-mono text-[#888] mt-1">60% des Arbeitsgewichts · Technikfokus · Vollständige Erholung</p>
            </div>
            {plan.deloadWeek.days.map((day, i) => <DayCard key={i} day={day} />)}
          </div>
        )}
      </div>

      <div className="border-t border-[#17171c] py-8 px-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <p className="text-sm font-mono text-[#555]">Dein Plan ist auf diesem Gerät gespeichert</p>
          <Button variant="ghost" size="sm" onClick={() => window.print()}>🖨 Drucken</Button>
        </div>
      </div>
    </div>
  );
}
