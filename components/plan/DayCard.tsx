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
    <div className="bg-[#0d0d10] border border-[#2a2a35] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[#17171c] flex items-start justify-between">
        <div>
          <h3 className="font-mono font-bold text-lg text-[#e8e8e8]">{day.name}</h3>
          <p className="text-xs font-mono text-[#888] mt-0.5">{day.focus}</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono text-[#d4ff00] bg-[rgba(212,255,0,0.1)] border border-[rgba(212,255,0,0.2)] px-2 py-1 rounded-full">
            {day.duration} Min.
          </span>
          <p className="text-xs font-mono text-[#555] mt-1">{day.exercises.length} Übungen</p>
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
