'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DayCard } from '@/components/plan/DayCard';
import { NutritionPanel } from '@/components/plan/NutritionPanel';
import { Button } from '@/components/ui/Button';
import { buildPlan } from '@/lib/plan-builder';
import { useQuestionnaireStore } from '@/store/questionnaire';
import type { GeneratedPlan } from '@/types';

type Tab = 'plan' | 'nutrition' | 'progression' | 'deload';

export default function PlanPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { inputs } = useQuestionnaireStore();
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [tab, setTab] = useState<Tab>('plan');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/plans?id=${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) { setPlan(data); setLoading(false); }
        else {
          // Build from store if API fails (e.g., DB not set up in preview)
          setPlan(buildPlan(inputs));
          setLoading(false);
        }
      })
      .catch(() => { setPlan(buildPlan(inputs)); setLoading(false); });
  }, [id, inputs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070709] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-[#d4ff00] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-mono text-[#888]">Generating your plan…</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#070709] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-mono text-[#888]">Plan not found.</p>
          <Button onClick={() => router.push('/questionnaire')}>Start Over</Button>
        </div>
      </div>
    );
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'plan', label: 'Training' },
    { key: 'nutrition', label: 'Nutrition' },
    { key: 'progression', label: 'Progression' },
    { key: 'deload', label: 'Deload' },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-[#e8e8e8]">
      {/* Hero */}
      <div className="border-b border-[#17171c] bg-[#0a0a0d]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-xs font-mono text-[#555] uppercase tracking-widest mb-2">
            DNA-Powered Training
          </p>
          <h1 className="text-3xl md:text-4xl font-mono font-bold text-[#e8e8e8] mb-1">
            {plan.name}
          </h1>
          <p className="text-sm font-mono text-[#888]">
            {plan.weeklyPlan.splitType} · {plan.weeklyPlan.days.length} days/week · Generated {new Date(plan.createdAt).toLocaleDateString()}
          </p>

          {/* Quick stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            {[
              { label: 'Target Cals', value: `${plan.nutrition.targetCalories} kcal` },
              { label: 'Protein', value: `${plan.nutrition.macros.protein}g` },
              { label: 'Training Days', value: `${plan.weeklyPlan.days.length}/wk` },
              { label: 'Session', value: `${plan.inputs.sessionDuration} min` },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#17171c] border border-[#2a2a35] rounded-xl px-4 py-3">
                <p className="text-xs font-mono text-[#555] uppercase tracking-wider">{stat.label}</p>
                <p className="text-lg font-mono font-bold text-[#d4ff00] mt-0.5">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="sticky top-0 z-10 bg-[#070709]/95 backdrop-blur border-b border-[#17171c]">
        <div className="max-w-4xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-3.5 text-sm font-mono font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                tab === t.key
                  ? 'border-[#d4ff00] text-[#d4ff00]'
                  : 'border-transparent text-[#555] hover:text-[#888]'
              }`}
            >
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
              <h2 className="font-mono font-bold text-[#e8e8e8]">Weekly Schedule</h2>
              <Button variant="outline" size="sm" onClick={() => router.push('/questionnaire')}>
                Rebuild Plan
              </Button>
            </div>
            {plan.weeklyPlan.days.map((day, i) => (
              <DayCard key={i} day={day} dayIndex={i} planId={plan.id} />
            ))}
          </div>
        )}

        {tab === 'nutrition' && (
          <div className="space-y-6">
            <h2 className="font-mono font-bold text-[#e8e8e8]">Nutrition Plan</h2>
            <NutritionPanel nutrition={plan.nutrition} />
          </div>
        )}

        {tab === 'progression' && (
          <div className="space-y-6">
            <h2 className="font-mono font-bold text-[#e8e8e8]">Progression Guide</h2>
            <div className="bg-[#0a0a0d] border border-[#2a2a35] rounded-2xl p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-mono text-[#888] uppercase tracking-wider">Weekly Increase</p>
                  <p className="text-2xl font-mono font-bold text-[#d4ff00] mt-1">
                    +{plan.progression.weeklyIncrease}kg
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono text-[#888] uppercase tracking-wider">Deload Every</p>
                  <p className="text-2xl font-mono font-bold text-[#d4ff00] mt-1">
                    {plan.progression.deloadFrequency} wks
                  </p>
                </div>
              </div>
              <div className="border-t border-[#17171c] pt-5 space-y-4">
                <div>
                  <p className="text-xs font-mono text-[#d4ff00] uppercase tracking-wider mb-2">Method</p>
                  <p className="text-sm font-mono text-[#888] leading-relaxed">{plan.progression.progressionMethod}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-[#d4ff00] uppercase tracking-wider mb-2">Deload Protocol</p>
                  <p className="text-sm font-mono text-[#888] leading-relaxed">{plan.progression.deloadProtocol}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-[#d4ff00] uppercase tracking-wider mb-2">Milestones</p>
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
              <h2 className="font-mono font-bold text-[#e8e8e8]">Deload Week</h2>
              <p className="text-sm font-mono text-[#888] mt-1">
                60% of working weight · Technique focus · Full recovery
              </p>
            </div>
            {plan.deloadWeek.days.map((day, i) => (
              <DayCard key={i} day={day} dayIndex={i} planId={plan.id} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-[#17171c] py-8 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <p className="text-sm font-mono text-[#555]">
            Share your plan · Print-friendly version coming soon
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" size="sm" onClick={() => window.print()}>🖨 Print</Button>
            <Button variant="outline" size="sm" onClick={() => navigator.share?.({ title: plan.name, url: window.location.href })}>
              Share
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
