'use client';
import { useState } from 'react';
import type { PlannedExercise } from '@/types';
import { Button } from '@/components/ui/Button';

interface ExerciseRowProps {
  ex: PlannedExercise;
  index: number;
  onSwap?: (ex: PlannedExercise) => void;
}

export function ExerciseRow({ ex, index, onSwap }: ExerciseRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[#2a2a35] bg-[#0a0a0d] rounded-xl overflow-hidden">
      <button
        className="w-full p-4 text-left flex items-center gap-4 hover:bg-[#0f0f12] transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="w-7 h-7 rounded-full bg-[#17171c] border border-[#2a2a35] text-xs font-mono text-[#888] flex items-center justify-center flex-shrink-0">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-mono font-bold text-[#e8e8e8] text-sm truncate">{ex.exercise.name}</div>
          <div className="text-xs font-mono text-[#888] mt-0.5">
            {ex.sets} × {ex.reps} · {ex.rest} rest
            {ex.rir !== undefined && ` · ${ex.rir} RIR`}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {ex.targetWeight && (
            <span className="text-xs font-mono text-[#d4ff00] bg-[rgba(212,255,0,0.1)] px-2 py-1 rounded-full border border-[rgba(212,255,0,0.2)]">
              ~{ex.targetWeight}kg
            </span>
          )}
          <span className="text-[#555] font-mono text-lg">{open ? '−' : '+'}</span>
        </div>
      </button>

      {open && (
        <div className="border-t border-[#17171c] p-4 space-y-4">
          <p className="text-sm font-mono text-[#888] leading-relaxed">{ex.exercise.description}</p>

          {ex.exercise.formCues.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-mono text-[#d4ff00] uppercase tracking-wider">Form Cues</p>
              <ul className="space-y-1">
                {ex.exercise.formCues.map((cue, i) => (
                  <li key={i} className="text-xs font-mono text-[#888] flex gap-2">
                    <span className="text-[#d4ff00] flex-shrink-0">▸</span>
                    {cue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {ex.exercise.commonMistakes.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-mono text-red-400 uppercase tracking-wider">Common Mistakes</p>
              <ul className="space-y-1">
                {ex.exercise.commonMistakes.map((m, i) => (
                  <li key={i} className="text-xs font-mono text-[#888] flex gap-2">
                    <span className="text-red-400 flex-shrink-0">✕</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {ex.exercise.equipment.map((eq) => (
              <span key={eq} className="text-xs font-mono text-[#888] bg-[#17171c] px-2 py-1 rounded-full border border-[#2a2a35]">
                {eq}
              </span>
            ))}
            <span className={`text-xs font-mono px-2 py-1 rounded-full border ${
              ex.exercise.difficulty === 'beginner' ? 'text-green-400 border-green-900 bg-green-950/30' :
              ex.exercise.difficulty === 'intermediate' ? 'text-yellow-400 border-yellow-900 bg-yellow-950/30' :
              'text-red-400 border-red-900 bg-red-950/30'
            }`}>
              {ex.exercise.difficulty}
            </span>
          </div>

          {onSwap && (
            <Button variant="outline" size="sm" onClick={() => onSwap(ex)}>
              ⇄ Swap Exercise
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
