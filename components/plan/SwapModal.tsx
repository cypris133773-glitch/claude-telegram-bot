'use client';
import { useEffect, useRef } from 'react';
import type { PlannedExercise } from '@/types';
import { EXERCISES } from '@/lib/exercise-db';

interface SwapModalProps {
  exercise: PlannedExercise;
  onClose: () => void;
}

export function SwapModal({ exercise, onClose }: SwapModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const alts = (exercise.exercise.alternatives ?? [])
    .map((id) => EXERCISES.find((e) => e.id === id))
    .filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        ref={ref}
        className="bg-[#0d0d10] border border-[#2a2a35] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#17171c] flex items-center justify-between">
          <div>
            <h3 className="font-mono font-bold text-[#e8e8e8]">Übung tauschen</h3>
            <p className="text-xs font-mono text-[#888] mt-0.5">Ersetze: {exercise.exercise.name}</p>
          </div>
          <button onClick={onClose} className="text-[#888] hover:text-[#e8e8e8] font-mono text-xl">✕</button>
        </div>

        <div className="p-5 space-y-3">
          {alts.length === 0 ? (
            <p className="text-sm font-mono text-[#888] text-center py-8">
              Keine Alternativen für diese Übung definiert.
            </p>
          ) : alts.map((alt) => alt && (
            <button
              key={alt.id}
              className="w-full text-left bg-[#0a0a0d] border border-[#2a2a35] rounded-xl p-4 hover:border-[#d4ff00] hover:bg-[rgba(212,255,0,0.05)] transition-all"
              onClick={() => {
                // In a real app this would update the plan store; for now close
                onClose();
              }}
            >
              <div className="font-mono font-bold text-sm text-[#e8e8e8]">{alt.name}</div>
              <div className="text-xs font-mono text-[#888] mt-1">{alt.description.slice(0, 100)}…</div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {alt.equipment.map((e) => (
                  <span key={e} className="text-xs font-mono text-[#555] bg-[#17171c] px-2 py-0.5 rounded-full border border-[#2a2a35]">
                    {e}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
