'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  GraduationCap,
  Globe2,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export function ScholarshipCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);

  const scholarships = [
    {
      id: 'nfst',
      code: 'NFST',
      title: 'National Fellowship for Scheduled Tribe Students',
      titleHi: 'अनुसूचित जनजाति के छात्रों के लिए राष्ट्रीय फैलोशिप',
      tag: 'India Research (Ph.D / M.Phil)',
      stipend: '₹31,000 - ₹35,000 / month + HRA & Contingency',
      slots: '750 Fresh Slots Annually',
      eligibility: 'ST Candidates admitted to Ph.D in Indian Universities & IITs/IIMs',
      officialUrl: 'https://tribal.gov.in',
      applyUrl: '/apply?scheme=nfst',
      bgGradient: 'from-blue-900 via-slate-900 to-slate-950',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      svgIcon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-emerald-400">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray="6 6" />
          <path d="M50 20 L80 40 L50 60 L20 40 Z" fill="currentColor" opacity="0.8" />
          <rect x="42" y="60" width="16" height="20" fill="currentColor" />
        </svg>
      )
    },
    {
      id: 'nos',
      code: 'NOS',
      title: 'National Overseas Scholarship for ST Candidates',
      titleHi: 'अनुसूचित जनजाति के लिए राष्ट्रीय ओवरसीज छात्रवृत्ति',
      tag: 'Abroad Study (Master’s & Ph.D in QS Top 500)',
      stipend: '100% Tuition Fee + US$ 15,400 Annual Maintenance Allowance',
      slots: '20 Slots Annually',
      eligibility: 'ST Candidates admitted to QS World Top 500 Foreign Universities',
      officialUrl: 'https://overseas.tribal.gov.in',
      applyUrl: '/apply?scheme=nos',
      bgGradient: 'from-purple-950 via-slate-900 to-slate-950',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      svgIcon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-purple-400">
          <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="3" />
          <ellipse cx="50" cy="50" rx="42" ry="18" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M50 8 L50 92 M8 50 L92 50" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 'top-class',
      code: 'TOP_CLASS',
      title: 'Top Class Education for ST Students',
      titleHi: 'अनुसूचित जनजाति के छात्रों के लिए शीर्ष श्रेणी शिक्षा',
      tag: 'Premier Institutes (IITs, NITs, IIMs, AIIMS, NLUs)',
      stipend: 'Full Tuition Fee + ₹45,000 Living Expenses + Laptop Allowance',
      slots: '1,000 Fresh Slots',
      eligibility: 'ST Students admitted to notified Top Class premier institutes',
      officialUrl: 'https://scholarships.gov.in',
      applyUrl: '/apply?scheme=topclass',
      bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      svgIcon: (
        <svg viewBox="0 0 100 100" className="w-16 h-16 text-amber-400">
          <polygon points="50,10 90,90 10,90" fill="none" stroke="currentColor" strokeWidth="4" />
          <circle cx="50" cy="60" r="15" fill="currentColor" />
        </svg>
      )
    }
  ];

  // Auto slide every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % scholarships.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [scholarships.length]);

  const current = scholarships[activeSlide];

  return (
    <div className="space-y-4">
      {/* Header & Nav Controls */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            OFFICIAL MOTA SCHOLARSHIP SLIDER
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-600" />
            <span>Available Fellowship Schemes & Rules</span>
          </h2>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSlide(prev => (prev - 1 + scholarships.length) % scholarships.length)}
            className="p-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
            title="Previous Scholarship"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-mono font-bold text-slate-500">
            {activeSlide + 1} / {scholarships.length}
          </span>
          <button
            onClick={() => setActiveSlide(prev => (prev + 1) % scholarships.length)}
            className="p-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
            title="Next Scholarship"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Active Slide Display Card */}
      <div className={`bg-linear-to-r ${current.bgGradient} text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden transition-all duration-500`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${current.badgeColor}`}>
                SCHEME CODE: {current.code}
              </span>
              <span className="text-xs text-amber-300 font-bold bg-amber-500/20 px-2.5 py-0.5 rounded border border-amber-500/30">
                {current.tag}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {current.title}
            </h3>
            <p className="text-xs text-slate-300 font-serif italic">{current.titleHi}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-white/10 p-3 rounded-xl border border-white/15">
                <span className="text-slate-400 block text-[11px]">Fellowship Stipend Rail</span>
                <span className="font-bold text-amber-300">{current.stipend}</span>
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/15">
                <span className="text-slate-400 block text-[11px]">Annual Slot Allocation</span>
                <span className="font-bold text-emerald-300">{current.slots}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span><strong>Eligibility:</strong> {current.eligibility}</span>
            </p>
          </div>

          {/* Right SVG Graphic & Direct Action Buttons */}
          <div className="flex flex-col items-center lg:items-end gap-4 shrink-0 w-full lg:w-auto">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md shadow-md flex items-center justify-center">
              {current.svgIcon}
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                href={current.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial bg-white text-slate-900 hover:bg-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Rules & Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <Link
                href={current.applyUrl}
                className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center justify-center gap-1.5"
              >
                <span>Apply Scholarship</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
