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
        'px-4 py-2 rounded-full text-sm font-mono font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff00] border',
        selected
          ? 'bg-[rgba(212,255,0,0.15)] border-[#d4ff00] text-[#d4ff00] shadow-[0_0_10px_rgba(212,255,0,0.2)]'
          : 'bg-[#17171c] border-[#2a2a35] text-[#888] hover:border-[#d4ff00] hover:text-[#e8e8e8]',
        disabled && 'opacity-40 cursor-not-allowed'
      )}
    >
      {label}
    </button>
  );
}
