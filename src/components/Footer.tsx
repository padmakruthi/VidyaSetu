'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from './LanguageContext';
import { ShieldCheck, HeartHandshake, PhoneCall, Award, ExternalLink } from 'lucide-react';

import { VidyasetuLogo } from './VidyasetuLogo';

export function Footer() {
  const { lang } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs mt-auto">
      {/* Top Banner with Team Info & Hackathon Badge */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="font-bold text-white text-xs tracking-wide">
              Ministry of Tribal Affairs (MoTA)
            </span>
            <span className="text-slate-500">|</span>
            <span className="bg-amber-950/80 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-800 text-[11px] font-mono font-bold">
              Sovereign DPI Infrastructure
            </span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              DPDP Act 2023 Compliant
            </span>
            <span className="flex items-center gap-1 text-blue-400 font-medium">
              <Award className="w-3.5 h-3.5" />
              MoTA Sovereign Rail
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand & Slogan */}
        <div className="space-y-3 md:col-span-1">
          <VidyasetuLogo size="md" variant="vertical" showSlogan={true} theme="dark" lang={lang} />
          <p className="text-[11px] text-slate-400 leading-relaxed text-center sm:text-left mt-2">
            AI-Enabled Lifecycle Scholarship & Fellowship Management Engine for Scheduled Tribes,
            eliminating clerical backlogs with 48-Hour sovereign verification.
          </p>
        </div>

        {/* Col 2: Flagship Schemes */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
            Flagship Schemes
          </h4>
          <ul className="space-y-2 text-[11px]">
            <li>
              <Link href="/apply?scheme=nfst" className="hover:text-amber-400 transition-colors">
                National Fellowship for ST (NFST) - Ph.D / M.Phil
              </Link>
            </li>
            <li>
              <Link href="/apply?scheme=nos" className="hover:text-amber-400 transition-colors">
                National Overseas Scholarship (NOS) - Master's / Ph.D Abroad
              </Link>
            </li>
            <li>
              <Link href="/track" className="hover:text-amber-400 transition-colors">
                Live 5-Stage Lifecycle Status Tracker
              </Link>
            </li>
            <li>
              <Link href="/portal" className="hover:text-amber-400 transition-colors">
                Student Portal & 1-Click Deficiency Resubmission
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Technical Approach & Mitigations */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
            Technical Architecture
          </h4>
          <ul className="space-y-2 text-[11px] text-slate-400">
            <li>• In-Browser Edge Blur Gate (Laplacian Var ≥ 100)</li>
            <li>• LayoutLMv3 Multimodal Token Alignment</li>
            <li>• Hybrid Jaro-Winkler + Bhashini AI NLP</li>
            <li>• 30-Second Officer Spotlight UI</li>
            <li>• Near-Zero Leakage via PFMS DBT Rails</li>
          </ul>
        </div>

        {/* Col 4: Contact & Helpline */}
        <div>
          <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">
            Tribal Scholar Support
          </h4>
          <div className="space-y-2 text-[11px]">
            <div className="flex items-center space-x-2 text-white font-semibold">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Toll Free: 1800-11-7777 (MoTA Desk)</span>
            </div>
            <p className="text-slate-400">
              Shastri Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001
            </p>
            <div className="pt-2">
              <span className="inline-block bg-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] font-mono border border-slate-700">
                WCAG 2.1 AA Compliant • Bilingual UI
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 py-4 px-4 text-center text-[11px] text-slate-500">
        <p>
          © 2026 Ministry of Tribal Affairs, Government of India. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
