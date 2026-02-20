import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DNA Fitness — Personalised Training Plans',
  description: 'Science-based personalised training and nutrition plans built from your data.',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'DNA Fitness' },
};

export const viewport: Viewport = {
  themeColor: '#070709',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#070709] text-[#e8e8e8] antialiased">{children}</body>
    </html>
  );
}
