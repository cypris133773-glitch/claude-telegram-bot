'use client';
import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex items-center justify-center font-mono font-bold tracking-widest uppercase transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4ff00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#070709] disabled:opacity-40 disabled:cursor-not-allowed',
          {
            'bg-[#d4ff00] text-[#070709] hover:bg-[#c0e800] shadow-[0_0_20px_rgba(212,255,0,0.3)] hover:shadow-[0_0_30px_rgba(212,255,0,0.5)]': variant === 'primary',
            'bg-transparent text-[#d4ff00] hover:bg-[rgba(212,255,0,0.08)] border border-[#d4ff00]': variant === 'outline',
            'bg-transparent text-[#888] hover:text-[#e8e8e8] hover:bg-[#17171c]': variant === 'ghost',
            'bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-800': variant === 'danger',
            'text-xs px-3 py-1.5 rounded': size === 'sm',
            'text-sm px-5 py-2.5 rounded-md': size === 'md',
            'text-base px-8 py-4 rounded-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading…
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';
export { Button };
