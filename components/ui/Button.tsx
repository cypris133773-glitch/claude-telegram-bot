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
          'inline-flex items-center justify-center font-mono font-bold tracking-widest uppercase transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#818cf8] focus-visible:ring-offset-2 focus-visible:ring-offset-[#06061a] disabled:opacity-40 disabled:cursor-not-allowed',
          {
            'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white hover:from-[#4f46e5] hover:to-[#7c3aed] shadow-[0_0_24px_rgba(99,102,241,0.4)] hover:shadow-[0_0_36px_rgba(99,102,241,0.6)]': variant === 'primary',
            'bg-transparent text-[#818cf8] hover:bg-[rgba(129,140,248,0.1)] border border-[#818cf8]': variant === 'outline',
            'bg-transparent text-[#9090b0] hover:text-[#e8e8f0] hover:bg-[#1a1a2e]': variant === 'ghost',
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
            Laden…
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
