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
        <span className="text-[#888] uppercase tracking-wider">{label}</span>
        <span className="text-[#e8e8e8] font-bold">{value}{unit}</span>
      </div>
      <div className="h-2 bg-[#17171c] rounded-full overflow-hidden">
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
          { label: 'BMR', value: nutrition.bmr, color: '#888' },
          { label: 'TDEE', value: nutrition.tdee, color: '#e8e8e8' },
          { label: 'TARGET', value: nutrition.targetCalories, color: '#d4ff00' },
        ].map((item) => (
          <div key={item.label} className="bg-[#0a0a0d] border border-[#2a2a35] rounded-xl p-4 text-center">
            <p className="text-xs font-mono text-[#555] uppercase tracking-wider">{item.label}</p>
            <p className="text-2xl font-mono font-bold mt-1" style={{ color: item.color }}>{item.value}</p>
            <p className="text-xs font-mono text-[#555]">kcal</p>
          </div>
        ))}
      </div>

      {/* Macros */}
      <div className="bg-[#0a0a0d] border border-[#2a2a35] rounded-xl p-5 space-y-4">
        <h4 className="font-mono font-bold text-[#e8e8e8] text-sm uppercase tracking-wider">Daily Macros</h4>
        <MacroBar label="Protein" value={macros.protein} unit="g" pct={Math.round((macros.protein*4/totalCals)*100)} color="#d4ff00" />
        <MacroBar label="Carbs" value={macros.carbs} unit="g" pct={Math.round((macros.carbs*4/totalCals)*100)} color="#00c8ff" />
        <MacroBar label="Fat" value={macros.fat} unit="g" pct={Math.round((macros.fat*9/totalCals)*100)} color="#ff6b35" />
      </div>

      {/* Timing */}
      <div className="bg-[#0a0a0d] border border-[#2a2a35] rounded-xl p-5 space-y-4">
        <h4 className="font-mono font-bold text-[#e8e8e8] text-sm uppercase tracking-wider">Meal Timing</h4>
        <div className="space-y-3">
          <div className="border-l-2 border-[#d4ff00] pl-3">
            <p className="text-xs font-mono text-[#d4ff00] uppercase tracking-wider mb-1">Pre-Workout</p>
            <p className="text-sm font-mono text-[#888]">{nutrition.preworkout}</p>
          </div>
          <div className="border-l-2 border-[#00c8ff] pl-3">
            <p className="text-xs font-mono text-[#00c8ff] uppercase tracking-wider mb-1">Post-Workout</p>
            <p className="text-sm font-mono text-[#888]">{nutrition.postworkout}</p>
          </div>
        </div>
        <ul className="space-y-2">
          {nutrition.mealTiming.map((tip, i) => (
            <li key={i} className="text-xs font-mono text-[#888] flex gap-2">
              <span className="text-[#d4ff00] flex-shrink-0">▸</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Hydration + Supplements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#0a0a0d] border border-[#2a2a35] rounded-xl p-5">
          <h4 className="font-mono font-bold text-[#e8e8e8] text-sm uppercase tracking-wider mb-3">💧 Hydration</h4>
          <p className="text-sm font-mono text-[#888]">{nutrition.hydration}</p>
        </div>
        <div className="bg-[#0a0a0d] border border-[#2a2a35] rounded-xl p-5">
          <h4 className="font-mono font-bold text-[#e8e8e8] text-sm uppercase tracking-wider mb-3">💊 Supplements</h4>
          <ul className="space-y-1">
            {nutrition.supplements.map((s, i) => (
              <li key={i} className="text-xs font-mono text-[#888] flex gap-2">
                <span className="text-[#d4ff00] flex-shrink-0">▸</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
