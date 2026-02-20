import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

const FEATURES = [
  { icon: '⚡', title: 'Wissenschaftlich fundierte Splits', desc: 'Ganzkörper, PPL, Oberkörper/Unterkörper — automatisch basierend auf deiner Verfügbarkeit und Erholung ausgewählt.' },
  { icon: '🧬', title: 'Personalisiert für dich', desc: '250 Übungen gefiltert nach deiner Ausrüstung, Verletzungen, Erfahrung und Schwachpunkten.' },
  { icon: '🥩', title: 'Präzise Ernährung', desc: 'Exakte Makros, Mahlzeitenzeiten, Hydrierungsziele und Supplement-Stacks berechnet aus deinen Körperdaten.' },
  { icon: '📈', title: 'Integrierte Progression', desc: 'Doppelte Progression und lineare Periodisierung mit automatisch geplanten Deload-Wochen.' },
  { icon: '🔄', title: 'Übungsalternativen', desc: 'Tausche sofort jede Übung gegen evidenzbasierte Alternativen, die zu deiner Ausrüstung passen.' },
  { icon: '📱', title: 'Mehrere Pläne', desc: 'Erstelle und speichere beliebig viele Trainingspläne — alle bleiben dauerhaft gespeichert und druckbar.' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#06061a] text-[#e8e8f0] font-mono">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-24 pb-16 text-center">
        {/* Glow effects */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[700px] h-[500px] bg-[#6366f1] opacity-[0.06] rounded-full blur-3xl" />
        </div>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#a855f7] opacity-[0.04] rounded-full blur-3xl pointer-events-none" />

        {/* Logo + Brand */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            <Image src="/logo.svg" alt="Logo" width={48} height={48} />
          </div>
          <span className="text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] to-[#c084fc]">
            FITGEN PRO
          </span>
        </div>

        <p className="text-xs text-[#4040a0] uppercase tracking-widest mb-6">
          KI-GESTEUERTES TRAININGSSYSTEM
        </p>
        <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-6 max-w-3xl mx-auto">
          Dein Plan.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] to-[#c084fc]">
            Wissenschaftlich entwickelt.
          </span>
        </h1>
        <p className="text-[#8080a8] text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Beantworte 12 Fragen. Erhalte einen personalisierten Training- und Ernährungsplan mit 250 Übungen — basierend auf Sportwissenschaft, keine Vorlagen.
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
        <div className="max-w-sm mx-auto mt-16 bg-[#0d0d1f] border border-[#1e1b4b] rounded-2xl p-5 text-left shadow-[0_0_40px_rgba(99,102,241,0.1)]">
          <div className="flex gap-1.5 mb-4">
            {['#ff5f57','#febc2e','#28c840'].map((c) => (
              <div key={c} className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-[#4040a0]">$ Plan wird erstellt…</p>
            <p><span className="text-[#818cf8]">split</span> <span className="text-[#e8e8f0]">→ Drücken / Ziehen / Beine</span></p>
            <p><span className="text-[#818cf8]">protein</span> <span className="text-[#e8e8f0]">→ 176g / Tag</span></p>
            <p><span className="text-[#818cf8]">kalorien</span> <span className="text-[#e8e8f0]">→ 2.840 kcal</span></p>
            <p><span className="text-[#818cf8]">übungen</span> <span className="text-[#e8e8f0]">→ 250 Übungen verfügbar</span></p>
            <p className="text-[#4040a0]">✓ <span className="text-[#e8e8f0]">Plan fertig in 0,3s</span></p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="how-it-works" className="px-4 py-20 max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-black text-center text-white mb-12">
          Was enthalten ist
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-[#0d0d1f] border border-[#1e1b4b] rounded-2xl p-6 hover:border-[#6366f1] hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all">
              <div className="text-3xl mb-4">{f.icon}</div>
              <h3 className="font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-[#8080a8] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section className="px-4 py-12 border-y border-[#1e1b4b] bg-[#0a0a18]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '250', label: 'Übungen' },
            { value: '12', label: 'Fragen' },
            { value: '4', label: 'Tabs (Plan/Ernährung/Progression/Deload)' },
            { value: '∞', label: 'Gespeicherte Pläne' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] to-[#c084fc]">{s.value}</div>
              <div className="text-xs text-[#8080a8] mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16 text-center">
        <h2 className="text-2xl font-black text-white mb-4">Bereit deinen Plan zu erstellen?</h2>
        <p className="text-[#8080a8] mb-8 text-sm">Dauert 3 Minuten. Kein Konto erforderlich. Pläne werden lokal gespeichert.</p>
        <Link href="/questionnaire">
          <Button size="lg">JETZT STARTEN →</Button>
        </Link>
      </section>

      <footer className="border-t border-[#1e1b4b] py-8 px-4 text-center text-xs text-[#4040a0]">
        <p>KI-gesteuertes Trainingssystem · Erstellt mit Next.js · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
