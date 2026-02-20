'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import type { ReactNode } from 'react';

const TOTAL_STEPS = 5;

interface StepWrapperProps {
  step: number;
  title: string;
  subtitle?: string;
  onNext: () => void;
  onBack?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  backLabel?: string;
  hideProgress?: boolean;
  children: ReactNode;
}

export function StepWrapper({
  step, title, subtitle, onNext, onBack, nextDisabled,
  nextLabel = 'WEITER →', backLabel = '← Zurück', hideProgress = false, children
}: StepWrapperProps) {
  return (
    <div className="min-h-screen bg-[#06061a] text-[#e8e8f0] flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-[#1e1b4b] bg-[#0a0a18]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl overflow-hidden shadow-[0_0_12px_rgba(59,130,246,0.5)]">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            </div>
            <div>
              <p className="text-sm font-mono font-bold text-white leading-tight">David N</p>
              <p className="text-[10px] font-mono text-[#60a5fa] tracking-wider">Trainingsplan Generator</p>
            </div>
          </div>
          {!hideProgress && <ProgressBar current={step} total={TOTAL_STEPS} />}
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
              {!hideProgress && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[#6366f1] bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)] px-2 py-0.5 rounded-full">
                    Schritt {step} / {TOTAL_STEPS}
                  </span>
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-mono font-bold text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[#8080a8] font-mono text-sm leading-relaxed">{subtitle}</p>
              )}
            </div>

            {children}
          </motion.div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="px-4 pb-8 pt-4 border-t border-[#1e1b4b] bg-[#0a0a18]">
        <div className="max-w-2xl mx-auto flex justify-between items-center gap-4">
          {onBack ? (
            <Button variant="ghost" size="sm" onClick={onBack}>{backLabel}</Button>
          ) : <div />}
          <Button size="lg" onClick={onNext} disabled={nextDisabled}>
            {nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
