import Link from 'next/link';
import { Button } from '@/components/ui/Button';

const FEATURES = [
  { icon: '⚡', title: 'Wissenschaftlich fundierte Splits', desc: 'Ganzkörper, PPL, Oberkörper/Unterkörper — automatisch basierend auf deiner Verfügbarkeit und Erholung ausgewählt.' },
  { icon: '🧬', title: 'Personalisiert für dich', desc: '50+ Übungen gefiltert nach deiner Ausrüstung, Verletzungen, Erfahrung und Schwachpunkten.' },
  { icon: '🥩', title: 'Präzise Ernährung', desc: 'Exakte Makros, Mahlzeitenzeiten, Hydrierungsziele und Supplement-Stacks berechnet aus deinen Körperdaten.' },
  { icon: '📈', title: 'Integrierte Progression', desc: 'Doppelte Progression und lineare Periodisierung mit automatisch geplanten Deload-Wochen.' },
  { icon: '🔄', title: 'Übungsalternativen', desc: 'Tausche sofort jede Übung gegen evidenzbasierte Alternativen, die zu deiner Ausrüstung passen.' },
  { icon: '📱', title: 'Funktioniert offline', desc: 'Progressive Web App — installiere sie auf deinem Handy und greife im Gym ohne Internet auf deinen Plan zu.' },
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
          DNA-GESTEUERTES TRAININGSSYSTEM
        </p>
        <h1 className="text-4xl md:text-6xl font-black text-[#e8e8e8] leading-[1.1] mb-6 max-w-3xl mx-auto">
          Dein Plan.<br />
          <span className="text-[#d4ff00]">Entwickelt.</span>
        </h1>
        <p className="text-[#888] text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Beantworte 12 Fragen. Erhalte einen personalisierten Training- und Ernährungsplan, basierend auf Sportwissenschaft — keine Vorlagen.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/questionnaire">
            <Button size="lg">MEINEN PLAN ERSTELLEN →</Button>
          </Link>
          <Link href="#how-it-works">
            <Button variant="ghost" size="lg">Wie es funktioniert</Button>
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
            <p className="text-[#555]">$ Plan wird erstellt…</p>
            <p><span className="text-[#d4ff00]">split</span> <span className="text-[#e8e8e8]">→ Drücken / Ziehen / Beine</span></p>
            <p><span className="text-[#d4ff00]">protein</span> <span className="text-[#e8e8e8]">→ 176g / Tag</span></p>
            <p><span className="text-[#d4ff00]">kalorien</span> <span className="text-[#e8e8e8]">→ 2.840 kcal</span></p>
            <p><span className="text-[#d4ff00]">übungen</span> <span className="text-[#e8e8e8]">→ 21 Übungen ausgewählt</span></p>
            <p className="text-[#555]">✓ <span className="text-[#e8e8e8]">Plan fertig in 0,3s</span></p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="px-4 py-20 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black text-center text-[#e8e8e8] mb-12">
          Was enthalten ist
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
        <h2 className="text-2xl font-black text-[#e8e8e8] mb-4">Bereit deinen Plan zu erstellen?</h2>
        <p className="text-[#888] mb-8 text-sm">Dauert 3 Minuten. Kein Konto erforderlich.</p>
        <Link href="/questionnaire">
          <Button size="lg">JETZT STARTEN →</Button>
        </Link>
      </section>

      <footer className="border-t border-[#17171c] py-8 px-4 text-center text-xs text-[#555]">
        <p>DNA-gesteuertes Trainingssystem · Erstellt mit Next.js · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
