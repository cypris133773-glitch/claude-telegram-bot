import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const FEATURES = [
  { icon: '⚡', title: 'Science-Based Splits', desc: 'Full Body, PPL, Upper/Lower — auto-selected based on your availability and recovery capacity.' },
  { icon: '🧬', title: 'Personalised to You', desc: '50+ exercises filtered by your equipment, injuries, experience, and weak points.' },
  { icon: '🥩', title: 'Precision Nutrition', desc: 'Exact macros, meal timing, hydration targets, and supplement stacks calculated from your biometrics.' },
  { icon: '📈', title: 'Built-In Progression', desc: 'Double progression and linear periodisation with auto-scheduled deload weeks.' },
  { icon: '🔄', title: 'Exercise Swaps', desc: 'Instantly swap any exercise for evidence-based alternatives that suit your equipment.' },
  { icon: '📱', title: 'Works Offline', desc: 'Progressive Web App — install on your phone and access your plan at the gym with no internet.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#070709] text-[#e8e8e8] font-mono">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-24 pb-16 text-center">
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-[#d4ff00] opacity-[0.04] rounded-full blur-3xl" />
        </div>

        <p className="text-xs text-[#555] uppercase tracking-widest mb-6">
          DNA-POWERED TRAINING SYSTEM
        </p>
        <h1 className="text-4xl md:text-6xl font-black text-[#e8e8e8] leading-[1.1] mb-6 max-w-3xl mx-auto">
          Your plan.<br />
          <span className="text-[#d4ff00]">Engineered.</span>
        </h1>
        <p className="text-[#888] text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Answer 12 questions. Get a personalised training and nutrition plan built from exercise science — not templates.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/questionnaire">
            <Button size="lg">BUILD MY PLAN →</Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="ghost" size="lg">How It Works</Button>
          </Link>
        </div>

        {/* Mock terminal card */}
        <div className="max-w-sm mx-auto mt-16 bg-[#0a0a0d] border border-[#2a2a35] rounded-2xl p-5 text-left shadow-[0_0_40px_rgba(212,255,0,0.05)]">
          <div className="flex gap-1.5 mb-4">
            {['#ff5f57','#febc2e','#28c840'].map((c) => (
              <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-[#555]">$ generating plan…</p>
            <p><span className="text-[#d4ff00]">split</span> <span className="text-[#e8e8e8]">→ Push / Pull / Legs</span></p>
            <p><span className="text-[#d4ff00]">protein</span> <span className="text-[#e8e8e8]">→ 176g / day</span></p>
            <p><span className="text-[#d4ff00]">calories</span> <span className="text-[#e8e8e8]">→ 2,840 kcal</span></p>
            <p><span className="text-[#d4ff00]">exercises</span> <span className="text-[#e8e8e8]">→ 21 exercises selected</span></p>
            <p className="text-[#555]">✓ <span className="text-[#e8e8e8]">Plan ready in 0.3s</span></p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="px-4 py-20 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black text-center text-[#e8e8e8] mb-12">
          What&apos;s included
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-[#0a0a0d] border border-[#2a2a35] rounded-2xl p-6 hover:border-[#444] transition-colors">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-[#e8e8e8] mb-2">{f.title}</h3>
              <p className="text-sm text-[#888] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center border-t border-[#17171c]">
        <h2 className="text-2xl font-black text-[#e8e8e8] mb-4">Ready to build your plan?</h2>
        <p className="text-[#888] mb-8 text-sm">Takes 3 minutes. No account required to generate.</p>
        <Link href="/questionnaire">
          <Button size="lg">START NOW →</Button>
        </Link>
      </section>

      <footer className="border-t border-[#17171c] py-8 px-4 text-center text-xs text-[#555]">
        <p>DNA-Powered Training System · Built with Next.js · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
