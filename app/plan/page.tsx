'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuestionnaireStore } from '@/store/questionnaire';
import { usePlansStore } from '@/store/plans';
import { DayCard } from '@/components/plan/DayCard';
import { NutritionPanel } from '@/components/plan/NutritionPanel';
import { Button } from '@/components/ui/Button';
import type { GeneratedPlan } from '@/types';

type Tab = 'plan' | 'nutrition' | 'progression' | 'deload';

export default function PlanPage() {
  const { reset } = useQuestionnaireStore();
  const { plans, activePlanId, setActivePlan, removePlan } = usePlansStore();
  const router = useRouter();
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [tab, setTab] = useState<Tab>('plan');
  const [showPlanList, setShowPlanList] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (plans.length === 0) {
      router.push('/questionnaire');
      return;
    }
    const active = plans.find((p) => p.id === activePlanId) ?? plans[0];
    if (active) {
      setPlan(active);
      if (active.id !== activePlanId) setActivePlan(active.id);
    }
  }, [mounted, plans, activePlanId, setActivePlan, router]);

  if (!plan) {
    return (
      <div className="min-h-screen bg-[#06061a] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'plan', label: 'Training' },
    { key: 'nutrition', label: 'Ernährung' },
    { key: 'progression', label: 'Progression' },
    { key: 'deload', label: 'Deload' },
  ];

  const GOAL_LABELS: Record<string, string> = {
    strength: 'Kraft', hypertrophy: 'Muskelaufbau', definition: 'Definition', recomp: 'Recomp',
  };

  return (
    <div className="min-h-screen bg-[#06061a] text-[#e8e8f0]">
      {/* Print header — only visible when printing */}
      <div className="hidden print:block print:mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
          </div>
          <span className="font-bold text-lg">FITGEN PRO — Trainingsplan</span>
        </div>
        <div className="text-sm text-gray-600">
          {plan.name} · {plan.weeklyPlan.splitType} · Erstellt am {new Date(plan.createdAt).toLocaleDateString('de-DE')}
        </div>
        <hr className="mt-2 mb-4"/>
      </div>

      {/* App Header */}
      <div className="border-b border-[#1e1b4b] bg-[#0a0a18] print:hidden">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="w-8 h-8 rounded-xl overflow-hidden shadow-[0_0_12px_rgba(99,102,241,0.4)] cursor-pointer">
                <Image src="/logo.svg" alt="Logo" width={32} height={32} />
              </div>
            </Link>
            <span className="text-xs font-mono text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] to-[#c084fc] tracking-widest font-bold hidden sm:block">
              FITGEN PRO
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Plan switcher */}
            <button
              onClick={() => setShowPlanList(!showPlanList)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#2d2b55] bg-[#13132a] hover:border-[#6366f1] transition-colors text-xs font-mono text-[#818cf8]"
            >
              <span>📋</span>
              <span className="hidden sm:inline">Pläne ({plans.length})</span>
              <span className="sm:hidden">{plans.length}</span>
            </button>
            <Button size="sm" onClick={() => { reset(); router.push('/questionnaire'); }}>
              + Neuer Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Plans list dropdown */}
      {showPlanList && (
        <div className="border-b border-[#1e1b4b] bg-[#0d0d1f] print:hidden">
          <div className="max-w-5xl mx-auto px-4 py-4">
            <p className="text-xs font-mono text-[#8080a8] uppercase tracking-wider mb-3">Gespeicherte Pläne</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {plans.map((p) => (
                <div
                  key={p.id}
                  className={`relative rounded-xl border p-3 cursor-pointer transition-all ${
                    p.id === plan.id
                      ? 'border-[#6366f1] bg-[rgba(99,102,241,0.1)]'
                      : 'border-[#2d2b55] bg-[#13132a] hover:border-[#6366f1]/50'
                  }`}
                  onClick={() => { setActivePlan(p.id); setPlan(p); setShowPlanList(false); }}
                >
                  <p className="font-mono font-bold text-sm text-white truncate">{p.name}</p>
                  <p className="text-xs font-mono text-[#8080a8] mt-1">{p.weeklyPlan.splitType}</p>
                  <p className="text-xs font-mono text-[#4040a0] mt-0.5">
                    {new Date(p.createdAt).toLocaleDateString('de-DE')}
                  </p>
                  {p.id === plan.id && (
                    <span className="absolute top-2 right-2 text-xs font-mono text-[#818cf8] bg-[rgba(99,102,241,0.2)] px-1.5 py-0.5 rounded-full">
                      Aktiv
                    </span>
                  )}
                  {deleteConfirm === p.id ? (
                    <div className="flex gap-2 mt-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="text-xs font-mono text-red-400 bg-red-950/30 border border-red-800 px-2 py-0.5 rounded"
                        onClick={() => { removePlan(p.id); setDeleteConfirm(null); if (p.id === plan.id) setShowPlanList(false); }}
                      >
                        Löschen bestätigen
                      </button>
                      <button
                        className="text-xs font-mono text-[#8080a8] hover:text-white"
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Abbrechen
                      </button>
                    </div>
                  ) : (
                    <button
                      className="absolute bottom-2 right-2 text-xs font-mono text-[#4040a0] hover:text-red-400 transition-colors"
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm(p.id); }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Plan Hero */}
      <div className="border-b border-[#1e1b4b] bg-gradient-to-br from-[#0a0a18] to-[#0d0d1f]">
        <div className="max-w-5xl mx-auto px-4 py-6 print:py-2">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-[#6366f1] bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)] px-2 py-0.5 rounded-full">
                  {GOAL_LABELS[plan.inputs.goal] ?? plan.inputs.goal}
                </span>
                <span className="text-xs font-mono text-[#4040a0]">
                  {new Date(plan.createdAt).toLocaleDateString('de-DE')}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-mono font-bold text-white">{plan.name}</h1>
              <p className="text-sm font-mono text-[#8080a8] mt-1">
                {plan.weeklyPlan.splitType} · {plan.weeklyPlan.days.length} Tage/Woche
                {' · '}{plan.inputs.age} Jahre · {plan.inputs.weight}kg · {plan.inputs.height}cm
              </p>
            </div>
            <div className="flex gap-2 print:hidden">
              <Button variant="outline" size="sm" onClick={() => window.print()}>
                🖨️ Drucken
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            {[
              { label: 'Zielkalorien', value: `${plan.nutrition.targetCalories} kcal` },
              { label: 'Protein', value: `${plan.nutrition.macros.protein}g` },
              { label: 'Trainingstage', value: `${plan.weeklyPlan.days.length}/Woche` },
              { label: 'Einheit', value: `${plan.inputs.sessionDuration} Min.` },
            ].map((s) => (
              <div key={s.label} className="bg-[#13132a] border border-[#2d2b55] rounded-xl px-4 py-3">
                <p className="text-xs font-mono text-[#4040a0] uppercase tracking-wider">{s.label}</p>
                <p className="text-base font-mono font-bold text-[#818cf8] mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-10 bg-[#06061a]/95 backdrop-blur border-b border-[#1e1b4b] print:hidden">
        <div className="max-w-5xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3.5 text-sm font-mono font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                tab === t.key
                  ? 'border-[#6366f1] text-[#818cf8]'
                  : 'border-transparent text-[#4040a0] hover:text-[#8080a8]'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 print:px-0 print:py-0">
        {/* Print: show all training plan content */}
        <div className="hidden print:block space-y-4">
          <h2 className="font-bold text-base border-b pb-2 mb-4">Wochentrainingsplan</h2>
          {plan.weeklyPlan.days.map((day, i) => <DayCard key={i} day={day} />)}
        </div>

        {/* Screen: tabs */}
        <div className="print:hidden">
          {tab === 'plan' && (
            <div className="space-y-4">
              <h2 className="font-mono font-bold text-white">Wochenplan</h2>
              {plan.weeklyPlan.days.map((day, i) => <DayCard key={i} day={day} />)}
            </div>
          )}

          {tab === 'nutrition' && (
            <div className="space-y-6">
              <h2 className="font-mono font-bold text-white">Ernährungsplan</h2>
              <NutritionPanel nutrition={plan.nutrition} />
            </div>
          )}

          {tab === 'progression' && (
            <div className="space-y-6">
              <h2 className="font-mono font-bold text-white">Progressionsleitfaden</h2>
              <div className="bg-[#0a0a18] border border-[#1e1b4b] rounded-2xl p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-mono text-[#8080a8] uppercase tracking-wider">Wöchentliche Steigerung</p>
                    <p className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] to-[#c084fc] mt-1">+{plan.progression.weeklyIncrease}kg</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-[#8080a8] uppercase tracking-wider">Deload alle</p>
                    <p className="text-3xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] to-[#c084fc] mt-1">{plan.progression.deloadFrequency} Wo.</p>
                  </div>
                </div>
                <div className="border-t border-[#1e1b4b] pt-5 space-y-4">
                  <div>
                    <p className="text-xs font-mono text-[#818cf8] uppercase tracking-wider mb-2">Methode</p>
                    <p className="text-sm font-mono text-[#9090b8] leading-relaxed">{plan.progression.progressionMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-[#818cf8] uppercase tracking-wider mb-2">Deload-Protokoll</p>
                    <p className="text-sm font-mono text-[#9090b8] leading-relaxed">{plan.progression.deloadProtocol}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-[#818cf8] uppercase tracking-wider mb-2">Meilensteine</p>
                    <ul className="space-y-2">
                      {plan.progression.milestones.map((m, i) => (
                        <li key={i} className="text-sm font-mono text-[#9090b8] flex gap-2">
                          <span className="text-[#6366f1]">▸</span>{m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'deload' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-mono font-bold text-white">Deload-Woche</h2>
                <p className="text-sm font-mono text-[#8080a8] mt-1">60% des Arbeitsgewichts · Technikfokus · Vollständige Erholung</p>
              </div>
              {plan.deloadWeek.days.map((day, i) => <DayCard key={i} day={day} />)}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#1e1b4b] py-6 px-4 print:hidden">
        <div className="max-w-5xl mx-auto flex justify-between items-center flex-wrap gap-4">
          <p className="text-sm font-mono text-[#4040a0]">
            ✓ Plan dauerhaft gespeichert · {plans.length} Plan{plans.length !== 1 ? 'ä' : ''} insgesamt
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => window.print()}>
              🖨️ Drucken (DIN A4)
            </Button>
            <Button size="sm" onClick={() => { reset(); router.push('/questionnaire'); }}>
              + Neuer Plan
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
