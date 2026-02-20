'use client';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full" role="progressbar" aria-valuenow={current} aria-valuemin={1} aria-valuemax={total}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-mono text-[#888]">STEP {current} / {total}</span>
        <span className="text-xs font-mono text-[#d4ff00]">{pct}%</span>
      </div>
      <div className="h-0.5 bg-[#17171c] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#d4ff00] rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(212,255,0,0.6)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-1.5 mt-3">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full flex-1 transition-all duration-300 ${
              i < current ? 'bg-[#d4ff00]' : 'bg-[#17171c]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
