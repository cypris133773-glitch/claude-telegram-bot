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
        <span className="text-xs font-mono text-[#8080a8]">SCHRITT {current} / {total}</span>
        <span className="text-xs font-mono text-[#818cf8]">{pct}%</span>
      </div>
      <div className="h-1 bg-[#1a1a35] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(99,102,241,0.6)]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-1.5 mt-3">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full flex-1 transition-all duration-300 ${
              i < current ? 'bg-gradient-to-r from-[#6366f1] to-[#a855f7]' : 'bg-[#1a1a35]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
