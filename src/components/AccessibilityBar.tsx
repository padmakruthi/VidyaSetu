'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from './LanguageContext';
import { initialUsers } from '@/lib/store';
import { Eye, Type, Globe, UserCheck, ShieldCheck } from 'lucide-react';
import { IndianFlag } from './IndianFlag';

export function AccessibilityBar() {
  const router = useRouter();
  const {
    lang,
    setLang,
    fontSize,
    setFontSize,
    highContrast,
    setHighContrast,
    currentUser,
    switchUser
  } = useLanguage();

  return (
    <div className="bg-slate-900 text-slate-200 text-xs border-b border-slate-800 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 z-50">
      {/* Tricolor Tiranga Flag and Govt Label */}
      <div className="flex items-center space-x-2">
        <IndianFlag size="sm" />
        <span className="font-medium tracking-wide">
          {lang === 'hi' ? 'भारत सरकार | जनजातीय कार्य मंत्रालय' : 'GOVERNMENT OF INDIA | MINISTRY OF TRIBAL AFFAIRS'}
        </span>
        <span className="hidden md:inline-flex items-center gap-1 text-[11px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full border border-slate-700">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Sovereign DPI
        </span>
      </div>

      {/* Controls: Accessibility + Language */}
      <div className="flex items-center flex-wrap gap-3">

        {/* Font Sizing Buttons */}
        <div className="hidden sm:flex items-center space-x-1 bg-slate-800 px-1.5 py-0.5 rounded-md">
          <Type className="w-3 h-3 text-slate-400 mr-0.5" />
          <button
            onClick={() => setFontSize('normal')}
            className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${fontSize === 'normal' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Normal text size"
            aria-label="Normal text size"
          >
            A-
          </button>
          <button
            onClick={() => setFontSize('large')}
            className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${fontSize === 'large' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Large text size"
            aria-label="Large text size"
          >
            A
          </button>
          <button
            onClick={() => setFontSize('xlarge')}
            className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${fontSize === 'xlarge' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            title="Extra large text size"
            aria-label="Extra large text size"
          >
            A+
          </button>
        </div>

        {/* High Contrast Toggle */}
        <button
          onClick={() => setHighContrast(!highContrast)}
          className={`hidden md:flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] ${
            highContrast ? 'bg-yellow-400 text-black border-yellow-300 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
          }`}
          title="Toggle high contrast mode"
        >
          <Eye className="w-3 h-3" />
          {highContrast ? 'Contrast ON' : 'High Contrast'}
        </button>

        {/* Bilingual Toggle */}
        <div className="flex items-center space-x-1 bg-emerald-950/80 border border-emerald-800/80 rounded-md px-1.5 py-0.5 text-[11px]">
          <Globe className="w-3 h-3 text-emerald-400" />
          <button
            onClick={() => setLang('en')}
            className={`px-1 py-0.5 rounded ${lang === 'en' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            English
          </button>
          <span className="text-slate-600">|</span>
          <button
            onClick={() => setLang('hi')}
            className={`px-1 py-0.5 rounded ${lang === 'hi' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-300 hover:text-white'}`}
          >
            हिन्दी
          </button>
        </div>
      </div>
    </div>
  );
}
