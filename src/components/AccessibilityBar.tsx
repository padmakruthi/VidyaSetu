'use client';

import React from 'react';
import { useLanguage } from './LanguageContext';
import { initialUsers } from '@/lib/store';
import { Eye, Type, Globe, UserCheck, ShieldCheck } from 'lucide-react';

export function AccessibilityBar() {
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
      {/* Tricolor stripe and Govt Label */}
      <div className="flex items-center space-x-2">
        <div className="flex h-3 w-5 rounded-xs overflow-hidden shadow-xs border border-white/20">
          <div className="h-1 bg-amber-500 w-full" />
          <div className="h-1 bg-white w-full flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-blue-900" />
          </div>
          <div className="h-1 bg-emerald-600 w-full" />
        </div>
        <span className="font-medium tracking-wide">
          {lang === 'hi' ? 'भारत सरकार | जनजातीय कार्य मंत्रालय' : 'GOVERNMENT OF INDIA | MINISTRY OF TRIBAL AFFAIRS'}
        </span>
        <span className="hidden md:inline-flex items-center gap-1 text-[11px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full border border-slate-700">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          SIH Prototype
        </span>
      </div>

      {/* Controls: Quick Role Switcher + Accessibility + Language */}
      <div className="flex items-center flex-wrap gap-3">
        {/* Quick Role Switcher for Hackathon Judges */}
        <div className="flex items-center space-x-1.5 bg-slate-800/90 px-2 py-0.5 rounded-md border border-slate-700">
          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] text-slate-300 font-medium">Demo Role:</span>
          <select
            value={currentUser.id}
            onChange={(e) => {
              const selected = initialUsers.find(u => u.id === e.target.value);
              if (selected) switchUser(selected);
            }}
            className="bg-transparent text-amber-300 font-semibold text-[11px] outline-none cursor-pointer focus:ring-1 focus:ring-amber-400 rounded px-1"
            aria-label="Select demo role for evaluation"
          >
            <option value="user-arun" className="bg-slate-900 text-white">
              Arun Soren (Applicant - NFST Verified)
            </option>
            <option value="user-sunita" className="bg-slate-900 text-white">
              Sunita Munda (Applicant - NOS Shortlisted)
            </option>
            <option value="user-vipin" className="bg-slate-900 text-white">
              Vipin Gond (Applicant - Deficiency Flagged)
            </option>
            <option value="user-scrutiny" className="bg-slate-900 text-white">
              Dr. Rajeshwar Rao (Scrutiny Officer)
            </option>
            <option value="user-committee" className="bg-slate-900 text-white">
              Prof. Kamala Tirkey (Selection Committee)
            </option>
            <option value="user-admin" className="bg-slate-900 text-white">
              Smt. Ananya Sen, IAS (MoTA Admin)
            </option>
          </select>
        </div>

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
