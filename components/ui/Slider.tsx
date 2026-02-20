'use client';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (val: number) => void;
  label?: string;
  unit?: string;
}

export function Slider({ value, min, max, step = 1, onChange, label, unit }: SliderProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        {label && <span className="text-sm text-[#888] font-mono">{label}</span>}
        <span className="text-2xl font-mono font-bold text-[#d4ff00]">
          {value}{unit && <span className="text-base text-[#888] ml-1">{unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#17171c] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#d4ff00] [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(212,255,0,0.5)] [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#d4ff00] [&::-moz-range-thumb]:border-0"
        aria-label={label}
      />
      <div className="flex justify-between text-xs font-mono text-[#555]">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
