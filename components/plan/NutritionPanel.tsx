'use client';
import type { NutritionPlan } from '@/types';

interface NutritionPanelProps {
  nutrition: NutritionPlan;
}

interface MacroBarProps { label: string; value: number; unit: string; pct: number; color: string }
function MacroBar({ label, value, unit, pct, color }: MacroBarProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-mono">
        <span className="text-[#8080a8] uppercase tracking-wider">{label}</span>
        <span className="text-white font-bold">{value}{unit}</span>
      </div>
      <div className="h-2 bg-[#1a1a35] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export function NutritionPanel({ nutrition }: NutritionPanelProps) {
  const { macros } = nutrition;
  const totalCals = macros.protein * 4 + macros.carbs * 4 + macros.fat * 9;

  return (
    <div className="space-y-6">
      {/* Calorie summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'BMR', value: nutrition.bmr, color: '#8080a8' },
          { label: 'TDEE', value: nutrition.tdee, color: '#c8c8f0' },
          { label: 'ZIEL', value: nutrition.targetCalories, color: '#818cf8' },
        ].map((item) => (
          <div key={item.label} className="bg-[#0a0a18] border border-[#1e1b4b] rounded-xl p-4 text-center">
            <p className="text-xs font-mono text-[#4040a0] uppercase tracking-wider">{item.label}</p>
            <p className="text-2xl font-mono font-bold mt-1" style={{ color: item.color }}>{item.value}</p>
            <p className="text-xs font-mono text-[#4040a0]">kcal</p>
          </div>
        ))}
      </div>

      {/* Macros */}
      <div className="bg-[#0a0a18] border border-[#1e1b4b] rounded-xl p-5 space-y-4">
        <h4 className="font-mono font-bold text-white text-sm uppercase tracking-wider">Tägliche Makros</h4>
        <MacroBar label="Protein" value={macros.protein} unit="g" pct={Math.round((macros.protein*4/totalCals)*100)} color="#818cf8" />
        <MacroBar label="Kohlenhydrate" value={macros.carbs} unit="g" pct={Math.round((macros.carbs*4/totalCals)*100)} color="#22d3ee" />
        <MacroBar label="Fett" value={macros.fat} unit="g" pct={Math.round((macros.fat*9/totalCals)*100)} color="#f472b6" />
      </div>

      {/* Timing */}
      <div className="bg-[#0a0a18] border border-[#1e1b4b] rounded-xl p-5 space-y-4">
        <h4 className="font-mono font-bold text-white text-sm uppercase tracking-wider">Mahlzeitenzeiten</h4>
        <div className="space-y-3">
          <div className="border-l-2 border-[#6366f1] pl-3">
            <p className="text-xs font-mono text-[#818cf8] uppercase tracking-wider mb-1">Vor dem Training</p>
            <p className="text-sm font-mono text-[#9090b8]">{nutrition.preworkout}</p>
          </div>
          <div className="border-l-2 border-[#22d3ee] pl-3">
            <p className="text-xs font-mono text-[#22d3ee] uppercase tracking-wider mb-1">Nach dem Training</p>
            <p className="text-sm font-mono text-[#9090b8]">{nutrition.postworkout}</p>
          </div>
        </div>
        <ul className="space-y-2">
          {nutrition.mealTiming.map((tip, i) => (
            <li key={i} className="text-xs font-mono text-[#9090b8] flex gap-2">
              <span className="text-[#6366f1] flex-shrink-0">▸</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Hydration + Supplements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0a0a18] border border-[#1e1b4b] rounded-xl p-5">
          <h4 className="font-mono font-bold text-white text-sm uppercase tracking-wider mb-3">💧 Flüssigkeitszufuhr</h4>
          <p className="text-sm font-mono text-[#9090b8]">{nutrition.hydration}</p>
        </div>
        <div className="bg-[#0a0a18] border border-[#1e1b4b] rounded-xl p-5">
          <h4 className="font-mono font-bold text-white text-sm uppercase tracking-wider mb-3">💊 Nahrungsergänzung</h4>
          <ul className="space-y-1">
            {nutrition.supplements.map((s, i) => (
              <li key={i} className="text-xs font-mono text-[#9090b8] flex gap-2">
                <span className="text-[#6366f1] flex-shrink-0">▸</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
