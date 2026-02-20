'use client';
import { useState } from 'react';
import type { TrainingDay, PlannedExercise } from '@/types';
import { ExerciseRow } from './ExerciseRow';
import { SwapModal } from './SwapModal';

interface DayCardProps {
  day: TrainingDay;
  dayIndex?: number;
  planId?: string;
}

export function DayCard({ day }: DayCardProps) {
  const [swapping, setSwapping] = useState<PlannedExercise | null>(null);

  return (
    <div className="bg-[#0d0d1f] border border-[#1e1b4b] rounded-2xl overflow-hidden print:break-inside-avoid print:border print:border-gray-300 print:rounded-lg">
      {/* Header */}
      <div className="p-5 border-b border-[#1e1b4b] flex items-start justify-between bg-gradient-to-r from-[#0d0d1f] to-[#12102a]">
        <div>
          <h3 className="font-mono font-bold text-lg text-white">{day.name}</h3>
          <p className="text-xs font-mono text-[#8080a8] mt-0.5">{day.focus}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-[#818cf8] bg-[rgba(129,140,248,0.1)] border border-[rgba(129,140,248,0.2)] px-2 py-1 rounded-full">
            {day.duration} Min.
          </span>
          <p className="text-xs font-mono text-[#4040a0] mt-1">{day.exercises.length} Übungen</p>
        </div>
      </div>

      {/* Exercise list */}
      <div className="p-5 space-y-3">
        {day.exercises.map((ex, i) => (
          <ExerciseRow
            key={ex.exerciseId + i}
            ex={ex}
            index={i}
            onSwap={ex.exerciseId !== 'cardio' ? (e) => setSwapping(e) : undefined}
          />
        ))}
      </div>

      {swapping && (
        <SwapModal
          exercise={swapping}
          onClose={() => setSwapping(null)}
        />
      )}
    </div>
  );
}
