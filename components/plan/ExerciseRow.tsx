'use client';
import { useState } from 'react';
import type { PlannedExercise } from '@/types';
import { ProsConsModal } from './ProsConsModal';

interface ExerciseRowProps {
  ex: PlannedExercise;
  index: number;
  onSwap?: (ex: PlannedExercise) => void;
}

export function ExerciseRow({ ex, index, onSwap }: ExerciseRowProps) {
  const [open, setOpen] = useState(false);
  const [showProsCons, setShowProsCons] = useState(false);

  const EQUIPMENT_DE: Record<string, string> = {
    barbell: 'Langhantel', dumbbell: 'Kurzhantel', cable: 'Kabel', machine: 'Maschine',
    bodyweight: 'Körpergewicht', bands: 'Bänder', kettlebell: 'Kettlebell',
  };

  return (
    <>
      <div className="border border-[#1e1b4b] bg-[#0d0d1f] rounded-xl overflow-hidden print:break-inside-avoid">
        {/* Main row */}
        <div className="p-3 flex items-center gap-3">
          {/* Number */}
          <span className="w-7 h-7 rounded-full bg-[#1a1a35] border border-[#2d2b55] text-xs font-mono text-[#8080a8] flex items-center justify-center flex-shrink-0">
            {index + 1}
          </span>

          {/* Clickable exercise name area */}
          <button
            className="flex-1 min-w-0 text-left hover:opacity-80 transition-opacity"
            onClick={() => setOpen(!open)}
            title="Klicken für Ausführungsdetails"
          >
            <div className="font-mono font-bold text-white text-sm truncate">{ex.exercise.name}</div>
            <div className="text-xs font-mono text-[#8080a8] mt-0.5">
              {ex.sets} × {ex.reps} · {ex.rest} Pause
              {ex.rir !== undefined && ` · ${ex.rir} RIR`}
            </div>
          </button>

          {/* Action buttons row */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {ex.targetWeight && (
              <span className="text-xs font-mono text-[#818cf8] bg-[rgba(129,140,248,0.1)] px-2 py-1 rounded-full border border-[rgba(129,140,248,0.2)] hidden sm:inline">
                ~{ex.targetWeight}kg
              </span>
            )}

            {/* Warning triangle — Pros/Cons */}
            <button
              onClick={(e) => { e.stopPropagation(); setShowProsCons(true); }}
              title="Vor- und Nachteile anzeigen"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-amber-500/10 transition-colors group print:hidden"
            >
              <span className="text-amber-400 text-base group-hover:scale-110 transition-transform">⚠</span>
            </button>

            {/* SWAP button — circular arrows */}
            {onSwap && (
              <button
                onClick={(e) => { e.stopPropagation(); onSwap(ex); }}
                title="Übung tauschen"
                className="w-8 h-8 flex items-center justify-center rounded-full border border-[#2d2b55] bg-[#13132a] hover:border-[#6366f1] hover:bg-[rgba(99,102,241,0.15)] transition-all group print:hidden"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#818cf8] group-hover:rotate-180 transition-transform duration-300">
                  <path d="M2 8a6 6 0 0 1 10.5-3.9M14 8a6 6 0 0 1-10.5 3.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M12 3l1 2-2 .5M4 13l-1-2 2-.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}

            {/* Expand toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="w-8 h-8 flex items-center justify-center text-[#4040a0] hover:text-[#818cf8] transition-colors text-lg font-mono print:hidden"
            >
              {open ? '−' : '+'}
            </button>
          </div>
        </div>

        {/* Expanded details */}
        {open && (
          <div className="border-t border-[#1e1b4b] p-4 space-y-4 bg-[#0a0a18]">
            {/* Description / How to perform */}
            <div className="bg-[#13132a] border border-[#1e1b4b] rounded-lg p-3">
              <p className="text-xs font-mono text-[#818cf8] uppercase tracking-wider mb-2 font-bold">Ausführung</p>
              <p className="text-sm font-mono text-[#c8c8e8] leading-relaxed">{ex.exercise.description}</p>
            </div>

            {ex.exercise.formCues.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-mono text-[#818cf8] uppercase tracking-wider font-bold">Ausführungshinweise</p>
                <ul className="space-y-1.5">
                  {ex.exercise.formCues.map((cue, i) => (
                    <li key={i} className="text-xs font-mono text-[#9090b8] flex gap-2">
                      <span className="text-[#6366f1] flex-shrink-0 mt-0.5">▸</span>
                      {cue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {ex.exercise.commonMistakes.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-mono text-red-400 uppercase tracking-wider font-bold">Häufige Fehler</p>
                <ul className="space-y-1.5">
                  {ex.exercise.commonMistakes.map((m, i) => (
                    <li key={i} className="text-xs font-mono text-[#9090b8] flex gap-2">
                      <span className="text-red-400 flex-shrink-0 mt-0.5">✕</span>
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              {ex.exercise.equipment.map((eq) => (
                <span key={eq} className="text-xs font-mono text-[#8080a8] bg-[#1a1a35] px-2 py-1 rounded-full border border-[#2d2b55]">
                  {EQUIPMENT_DE[eq] ?? eq}
                </span>
              ))}
              <span className={`text-xs font-mono px-2 py-1 rounded-full border ${
                ex.exercise.difficulty === 'beginner' ? 'text-emerald-400 border-emerald-900/50 bg-emerald-950/30' :
                ex.exercise.difficulty === 'intermediate' ? 'text-amber-400 border-amber-900/50 bg-amber-950/30' :
                'text-red-400 border-red-900/50 bg-red-950/30'
              }`}>
                {ex.exercise.difficulty === 'beginner' ? 'Anfänger' : ex.exercise.difficulty === 'intermediate' ? 'Fortgeschritten' : 'Experte'}
              </span>
            </div>
          </div>
        )}
      </div>

      {showProsCons && (
        <ProsConsModal exercise={ex.exercise} onClose={() => setShowProsCons(false)} />
      )}
    </>
  );
}
