'use client';
import { type InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  unit?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, unit, className, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-mono text-[#888] uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={clsx(
              'w-full bg-[#0f0f12] border text-[#e8e8e8] font-mono rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d4ff00] transition-all placeholder:text-[#444]',
              error ? 'border-red-700' : 'border-[#2a2a35] focus:border-[#d4ff00]',
              unit && 'pr-12',
              className
            )}
            {...props}
          />
          {unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-mono text-[#888]">
              {unit}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-400 font-mono">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
export { Input };
