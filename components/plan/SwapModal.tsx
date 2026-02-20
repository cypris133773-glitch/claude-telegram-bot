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
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        ref={ref}
        className="bg-[#0d0d1f] border border-[#1e1b4b] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-[0_0_40px_rgba(99,102,241,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#1e1b4b] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[rgba(99,102,241,0.2)] border border-[rgba(99,102,241,0.3)] rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none" className="text-[#818cf8]">
                <path d="M2 8a6 6 0 0 1 10.5-3.9M14 8a6 6 0 0 1-10.5 3.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 3l1 2-2 .5M4 13l-1-2 2-.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="font-mono font-bold text-white">Übung tauschen</h3>
              <p className="text-xs font-mono text-[#8080a8] mt-0.5">Ersetze: {exercise.exercise.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8080a8] hover:text-white font-mono text-xl transition-colors">✕</button>
        </div>

        <div className="p-5 space-y-3">
          {alts.length === 0 ? (
            <p className="text-sm font-mono text-[#8080a8] text-center py-8">
              Keine Alternativen für diese Übung definiert.
            </p>
          ) : alts.map((alt) => alt && (
            <button
              key={alt.id}
              className="w-full text-left bg-[#0a0a18] border border-[#1e1b4b] rounded-xl p-4 hover:border-[#6366f1] hover:bg-[rgba(99,102,241,0.08)] transition-all"
              onClick={() => {
                // In a real app this would update the plan store; for now close
                onClose();
              }}
            >
              <div className="font-mono font-bold text-sm text-white">{alt.name}</div>
              <div className="text-xs font-mono text-[#8080a8] mt-1">{alt.description.slice(0, 100)}…</div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {alt.equipment.map((e) => (
                  <span key={e} className="text-xs font-mono text-[#6060a0] bg-[#13132a] px-2 py-0.5 rounded-full border border-[#2d2b55]">
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
