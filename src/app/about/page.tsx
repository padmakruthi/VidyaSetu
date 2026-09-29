'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { IndianFlag } from '@/components/IndianFlag';
import {
  Users,
  Award,
  Sparkles,
  ShieldCheck,
  GraduationCap,
  Building,
  CheckCircle2,
  FileCheck,
  ArrowRight,
  ExternalLink,
  Code2,
  Cpu
} from 'lucide-react';

export default function AboutPage() {
  const { lang } = useLanguage();

  const teamMembers = [
    { name: 'Bhimavarapu Navya Sri', role: 'Team Leader', avatar: 'NS', color: 'bg-amber-600' },
    { name: 'B P S Kruthi', role: 'Team Member', avatar: 'BK', color: 'bg-emerald-600' },
    { name: 'Navadeep Vandhanapu', role: 'Team Member', avatar: 'NV', color: 'bg-blue-600' },
    { name: 'Navadeep Chandanam', role: 'Team Member', avatar: 'NC', color: 'bg-indigo-600' },
    { name: 'D Nilesh Choudhary', role: 'Team Member', avatar: 'NC', color: 'bg-purple-600' },
    { name: 'Chirra Karthika', role: 'Team Member', avatar: 'CK', color: 'bg-rose-600' }
  ];

  return (
    <div className="flex-1 bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* 1. Header Banner */}
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <IndianFlag size="sm" />
              <span className="bg-amber-500/20 text-amber-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-amber-500/30">
                SIH 2026 PROTOTYPE
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                TEAM ID: 171647
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              About VidyaSetu (विद्यासेतु)
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
              VidyaSetu is a sovereign AI-powered scholarship and fellowship management engine developed for the
              <strong> Ministry of Tribal Affairs (MoTA), Government of India</strong>. Designed under Smart India Hackathon (SIH 2026)
              to empower Scheduled Tribe (ST) scholars applying for NFST and NOS fellowships.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 48-Hour Decision SLA</span>
              <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-amber-400" /> Bhashini AI Transliteration</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-400" /> DigiLocker & PFMS DBT Rails</span>
            </div>
          </div>
        </div>

        {/* 2. SIH Team Details Section */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-1">
                SMART INDIA HACKATHON 2026 TEAM SPECIFICATION
              </div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-emerald-600" />
                <span>Team: Parallaxx_24951A05M7</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official SIH Team Registration ID: <strong>171647</strong>
              </p>
            </div>

            <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-mono font-bold">
              Team ID: <span className="text-amber-400">171647</span>
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-300 transition-all shadow-xs flex items-center gap-3.5"
              >
                <div className={`w-11 h-11 ${member.color} text-white rounded-xl flex items-center justify-center font-black text-sm shadow-xs shrink-0`}>
                  {member.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{member.name}</h3>
                  <span
                    className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                      member.role === 'Team Leader'
                        ? 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Official Schemes & Rules Link Section */}
        <div className="bg-linear-to-br from-blue-900 via-slate-900 to-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-md space-y-6">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" />
              <span>Official Available Schemes & Operational Guidelines</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Direct access to official MoTA fellowship rules, guidelines, and application portals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NFST Scheme Card */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-emerald-500/20 text-emerald-300 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded border border-emerald-500/30">
                  SCHEME: NFST
                </span>
                <span className="text-xs font-bold text-amber-300">₹31,000 - ₹35,000 / mo</span>
              </div>
              <h3 className="font-bold text-base text-white">National Fellowship for ST Students</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Provides 750 fresh slots annually for ST students pursuing M.Phil and Ph.D degrees in Indian Universities & IITs/IIMs.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://tribal.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-slate-900 hover:bg-slate-100 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>Official MoTA Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <Link
                  href="/apply?scheme=nfst"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* NOS Scheme Card */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-blue-500/20 text-blue-300 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded border border-blue-500/30">
                  SCHEME: NOS
                </span>
                <span className="text-xs font-bold text-amber-300">100% Foreign Tution + US$15,400</span>
              </div>
              <h3 className="font-bold text-base text-white">National Overseas Scholarship for ST Candidates</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Provides 20 slots annually for higher studies abroad (Master’s, Ph.D, Post-Doctoral) in QS Top 500 foreign universities.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://overseas.tribal.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-slate-900 hover:bg-slate-100 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>NOS Official Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <Link
                  href="/apply?scheme=nos"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1"
                >
                  <span>Apply NOS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
