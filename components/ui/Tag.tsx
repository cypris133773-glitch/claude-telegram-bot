'use client';
import { clsx } from 'clsx';

interface TagProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function Tag({ label, selected, onClick, disabled }: TagProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={clsx(
        'px-4 py-2 rounded-full text-sm font-mono font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818cf8] border',
        selected
          ? 'bg-[rgba(99,102,241,0.2)] border-[#6366f1] text-[#a5b4fc] shadow-[0_0_12px_rgba(99,102,241,0.3)]'
          : 'bg-[#13132a] border-[#2d2b55] text-[#8080a8] hover:border-[#6366f1] hover:text-[#e8e8f0]',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
    >
      {label}
    </button>
  );
}
