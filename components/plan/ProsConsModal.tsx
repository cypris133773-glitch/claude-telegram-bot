'use client';
import { useEffect, useRef } from 'react';
import type { Exercise } from '@/types';

interface ProsConsModalProps {
  exercise: Exercise;
  onClose: () => void;
}

export function ProsConsModal({ exercise, onClose }: ProsConsModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const pros = exercise.pros ?? [];
  const cons = exercise.cons ?? [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        ref={ref}
        className="bg-[#0d0d1f] border border-[#1e1b4b] rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-[0_0_40px_rgba(99,102,241,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#1e1b4b] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500/20 border border-amber-500/40 rounded-xl flex items-center justify-center">
              <span className="text-amber-400 text-lg font-bold">!</span>
            </div>
            <div>
              <h3 className="font-mono font-bold text-white text-sm">Vor- & Nachteile</h3>
              <p className="text-xs font-mono text-[#8080a8] mt-0.5 truncate max-w-[200px]">{exercise.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8080a8] hover:text-white font-mono text-xl transition-colors w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Pros */}
          <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold flex items-center gap-2">
              <span className="w-4 h-4 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-[10px]">✓</span>
              Vorteile
            </p>
            {pros.length > 0 ? (
              <ul className="space-y-2">
                {pros.map((pro, i) => (
                  <li key={i} className="text-sm font-mono text-[#c8f0d8] flex gap-2">
                    <span className="text-emerald-400 flex-shrink-0 mt-0.5 font-bold">+</span>
                    {pro}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm font-mono text-[#8080a8]">Keine Angaben</p>
            )}
          </div>

          {/* Cons */}
          <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 space-y-2">
            <p className="text-xs font-mono text-red-400 uppercase tracking-wider font-bold flex items-center gap-2">
              <span className="w-4 h-4 bg-red-500/20 border border-red-500/40 rounded-full flex items-center justify-center text-[10px]">✕</span>
              Nachteile
            </p>
            {cons.length > 0 ? (
              <ul className="space-y-2">
                {cons.map((con, i) => (
                  <li key={i} className="text-sm font-mono text-[#f0c8c8] flex gap-2">
                    <span className="text-red-400 flex-shrink-0 mt-0.5 font-bold">−</span>
                    {con}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm font-mono text-[#8080a8]">Keine Angaben</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
