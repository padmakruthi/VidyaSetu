import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/components/LanguageContext';
import { AccessibilityBar } from '@/components/AccessibilityBar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'VidyaSetu (विद्यासेतु) - MoTA Scholarship & Fellowship Management System',
  description:
    'AI-Enabled Lifecycle Scholarship & Fellowship Management Engine for Scheduled Tribes by Ministry of Tribal Affairs (MoTA), Government of India. Team parllaxx_24951A05M7 (SIH 2026).',
  keywords: [
    'VidyaSetu',
    'Ministry of Tribal Affairs',
    'NFST',
    'NOS',
    'Scheduled Tribes',
    'Smart India Hackathon',
    'parllaxx_24951A05M7'
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 text-slate-900 antialiased min-h-screen flex flex-col font-sans">
        <LanguageProvider>
          <AccessibilityBar />
          <Header />
          <main className="flex-1 flex flex-col">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
