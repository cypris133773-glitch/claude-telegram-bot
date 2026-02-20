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
        {label && <span className="text-sm text-[#8080a8] font-mono uppercase tracking-wider">{label}</span>}
        <span className="text-2xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] to-[#c084fc]">
          {value}{unit && <span className="text-base text-[#8080a8] ml-1">{unit}</span>}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#1a1a35] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-[#6366f1] [&::-webkit-slider-thumb]:to-[#a855f7] [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(99,102,241,0.6)] [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#6366f1] [&::-moz-range-thumb]:border-0"
        style={{ background: `linear-gradient(to right, #6366f1 ${((value - min) / (max - min)) * 100}%, #1a1a35 ${((value - min) / (max - min)) * 100}%)` }}
        aria-label={label}
      />
      <div className="flex justify-between text-xs font-mono text-[#4040a0]">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}
