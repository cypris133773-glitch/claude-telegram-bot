'use client';
import { motion } from 'framer-motion';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import type { ReactNode } from 'react';

const TOTAL_STEPS = 16;

interface StepWrapperProps {
  step: number;
  title: string;
  subtitle?: string;
  onNext: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  children: ReactNode;
}

export function StepWrapper({
  step, title, subtitle, onNext, onBack, nextDisabled, nextLabel = 'NEXT →', children
}: StepWrapperProps) {
  return (
    <div className="min-h-screen bg-[#070709] text-[#e8e8e8] flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-[#17171c]">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-mono text-[#555] tracking-widest mb-4">
            DNA-POWERED TRAINING SYSTEM
          </p>
          <ProgressBar current={step} total={TOTAL_STEPS} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-4 py-8">
        <div className="max-w-2xl mx-auto w-full">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl font-mono font-bold text-[#e8e8e8]">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[#888] font-mono text-sm leading-relaxed">{subtitle}</p>
              )}
            </div>

            {children}
          </motion.div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="px-4 pb-8 pt-4 border-t border-[#17171c]">
        <div className="max-w-2xl mx-auto flex justify-between items-center gap-4">
          {onBack ? (
            <Button variant="ghost" size="sm" onClick={onBack}>← Back</Button>
          ) : <div />}
          <Button size="lg" onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
