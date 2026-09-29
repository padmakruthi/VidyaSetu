'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Award,
  Globe2,
  FileCheck,
  Zap,
  TrendingUp,
  Cpu,
  Lock,
  Building,
  GraduationCap,
  Users2,
  AlertCircle
} from 'lucide-react';
import { IndianFlag } from '@/components/IndianFlag';
import { ScholarshipCarousel } from '@/components/ScholarshipCarousel';

export default function Home() {
  const router = useRouter();
  const { t, lang, currentUser } = useLanguage();

  const isApplicant = currentUser ? currentUser.role === 'APPLICANT' : true;

  // 60-Second Quick Eligibility Checker State
  const [eligibilityCheck, setEligibilityCheck] = useState({
    stCategory: 'yes',
    degree: 'pg_complete',
    pgMarks: '65',
    income: '250000',
    target: 'nfst'
  });
  const [eligibilityResult, setEligibilityResult] = useState<string | null>(null);

  const handleCheckEligibility = () => {
    const marks = parseFloat(eligibilityCheck.pgMarks);
    const income = parseFloat(eligibilityCheck.income);

    if (eligibilityCheck.stCategory !== 'yes') {
      setEligibilityResult('NOT_ELIGIBLE_ST');
      return;
    }

    if (eligibilityCheck.target === 'nfst') {
      if (marks >= 55) {
        setEligibilityResult('ELIGIBLE_NFST');
      } else {
        setEligibilityResult('MARKS_LOW_NFST');
      }
    } else {
      // NOS
      if (marks >= 60 && income <= 600000) {
        setEligibilityResult('ELIGIBLE_NOS');
      } else if (income > 600000) {
        setEligibilityResult('INCOME_HIGH_NOS');
      } else {
        setEligibilityResult('MARKS_LOW_NOS');
      }
    }
  };

  return (
    <div className="flex-1 bg-slate-50">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Decorative backdrop glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          {/* Top Tag & Sovereign Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs text-amber-300 font-medium mb-6 shadow-sm">
            <IndianFlag size="sm" />
            <span className="font-bold tracking-wide">MINISTRY OF TRIBAL AFFAIRS</span>
            <span className="text-white/40">•</span>
            <span className="bg-amber-400/20 text-amber-200 px-2.5 py-0.5 rounded font-mono font-semibold">
              Sovereign DPI Platform
            </span>
          </div>

          {/* Slogan & Main Title */}
          <div className="text-amber-400 font-serif text-lg sm:text-xl font-bold tracking-wide italic mb-2">
            {t.slogan}
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            {lang === 'hi'
              ? 'जनजातीय शोधार्थियों हेतु एआई-सक्षम जीवनचक्र छात्रवृत्ति प्रबंधन'
              : 'AI-Enabled Lifecycle Scholarship & Fellowship Engine for Scheduled Tribes'}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            {t.heroSubheading}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {isApplicant ? (
              <>
                <Link
                  href="/apply?scheme=nfst"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>{t.applyNfstBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/apply?scheme=nos"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  <Globe2 className="w-5 h-5" />
                  <span>{t.applyNosBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            ) : (
              <>
                {currentUser?.role === 'SELECTION_COMMITTEE' && (
                  <Link
                    href="/admin/selection"
                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-purple-900/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <Users2 className="w-5 h-5" />
                    <span>Go to Selection Committee Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                {currentUser?.role === 'SCRUTINY_OFFICER' && (
                  <Link
                    href="/admin"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <FileCheck className="w-5 h-5" />
                    <span>Go to Scrutiny Queue</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                {currentUser?.role === 'ADMIN' && (
                  <Link
                    href="/admin/analytics"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Go to Analytics Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </>
            )}

            <Link
              href="/track"
              className="bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 px-5 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center gap-2"
            >
              <span>{t.trackApplication}</span>
            </Link>
          </div>

          {/* 4 Impact Metric Cards (Directly from PPT Slide 5) */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {/* Metric 1 */}
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4.5 hover:border-emerald-500/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-white">{t.metric48Hours}</div>
              <div className="text-xs text-slate-400 mt-1 leading-snug">{t.metric48HoursSub}</div>
            </div>

            {/* Metric 2 */}
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4.5 hover:border-blue-500/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileCheck className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-white">{t.metricZeroBlur}</div>
              <div className="text-xs text-slate-400 mt-1 leading-snug">{t.metricZeroBlurSub}</div>
            </div>

            {/* Metric 3 */}
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4.5 hover:border-purple-500/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Globe2 className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-white">{t.metricZeroMissed}</div>
              <div className="text-xs text-slate-400 mt-1 leading-snug">{t.metricZeroMissedSub}</div>
            </div>

            {/* Metric 4 */}
            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-4.5 hover:border-amber-500/50 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-2xl font-black text-white">{t.metricSavings}</div>
              <div className="text-xs text-slate-400 mt-1 leading-snug">{t.metricSavingsSub}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Scholarship Available Carousel Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
        <ScholarshipCarousel />
      </section>

      {/* 2. 5-Stage Sovereign Lifecycle Audit Trail Strip (PPT Slide 2) */}
      <section className="bg-slate-900 border-b border-slate-800 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-widest shrink-0">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>AUDIT TRAIL:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-[11px] font-mono font-bold">
            <span className="bg-slate-800 text-blue-300 px-2.5 py-1 rounded-md border border-slate-700">
              1. IDENTITY VERIFIED
            </span>
            <span className="text-slate-600">➔</span>
            <span className="bg-slate-800 text-emerald-300 px-2.5 py-1 rounded-md border border-slate-700">
              2. DOCS VALIDATED
            </span>
            <span className="text-slate-600">➔</span>
            <span className="bg-slate-800 text-purple-300 px-2.5 py-1 rounded-md border border-slate-700">
              3. DATA CROSS-CHECKED
            </span>
            <span className="text-slate-600">➔</span>
            <span className="bg-slate-800 text-indigo-300 px-2.5 py-1 rounded-md border border-slate-700">
              4. ELIGIBILITY & RANKED
            </span>
            <span className="text-slate-600">➔</span>
            <span className="bg-slate-800 text-amber-300 px-2.5 py-1 rounded-md border border-slate-700">
              5. FUNDS DISBURSED
            </span>
            <span className="text-slate-600">➔</span>
            <span className="bg-slate-800 text-rose-300 px-2.5 py-1 rounded-md border border-slate-700">
              6. AUDIT & COMPLIANCE
            </span>
          </div>

          <div className="hidden lg:block text-[11px] text-slate-400 font-medium">
            Strict Policy: Zero Autonomous Rejections
          </div>
        </div>
      </section>

      {/* 3. Flagship MoTA Schemes Cards & 4. Eligibility Checker (Applicant Only Content) */}
      {isApplicant && (
        <>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                MoTA Fellowships & Scholarships
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                {t.activeSchemesHeading}
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Configurable eligibility rules engine dynamically calculates merit, quotas, and PFMS stipends.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Scheme 1: NFST */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
                      DOMESTIC RESEARCH (750 SLOTS)
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      Code: NFST
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    National Fellowship for Scheduled Tribe Students (NFST)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    Direct monthly financial assistance for regular full-time M.Phil & Ph.D scholars in UGC-recognized
                    Indian Universities, IITs, NITs, and premier institutions.
                  </p>

                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Monthly Fellowship:</span>
                      <span className="font-bold text-slate-900">₹31,000 / month (JRF) + HRA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Annual Contingency:</span>
                      <span className="font-bold text-slate-900">₹25,000 / year</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Family Income Cap:</span>
                      <span className="font-bold text-emerald-600">No Income Ceiling Limit</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Eligible Criteria:</span>
                      <span className="font-bold text-slate-900">ST + Post-Graduation (≥ 55%) + UGC-NET / CSIR-NET</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Turnaround Target:</span>
                      <span className="font-bold text-blue-600">48-Hour Fast Track Verification</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500">Deadline: 15 Nov 2026</span>
                  <Link
                    href="/apply?scheme=nfst"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Apply for NFST</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Scheme 2: NOS */}
              <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-300">
                      OVERSEAS GLOBAL (20 SLOTS)
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">
                      Code: NOS
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    National Overseas Scholarship for ST Candidates (NOS)
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    Full funding covering entire foreign university tuition fees, annual contingency, and living allowance
                    for pursuing Master's and Ph.D in QS Top 500 global institutions.
                  </p>

                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Total Assistance:</span>
                      <span className="font-bold text-slate-900">100% Tuition Fees + Living Grant</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Living Allowance:</span>
                      <span className="font-bold text-slate-900">£9,900 / $15,400 per annum</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Income Ceiling Limit:</span>
                      <span className="font-bold text-amber-600">≤ ₹6,00,000 / year total</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Institution Benchmark:</span>
                      <span className="font-bold text-slate-900">QS World Ranking Top 500</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Zero Missed Intakes:</span>
                      <span className="font-bold text-blue-600">Visa deadlines protected</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-xs text-slate-500">Deadline: 31 Oct 2026</span>
                  <Link
                    href="/apply?scheme=nos"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Apply for NOS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Quick 60-Second Eligibility Checker (for Rural First-Gen Scholars) */}
          <section className="bg-slate-100 border-y border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {t.checkEligibility}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Simple tool for students to check MoTA fellowship qualification before filling the form.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs mt-6">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Scheme</label>
                  <select
                    value={eligibilityCheck.target}
                    onChange={e => setEligibilityCheck({ ...eligibilityCheck, target: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs outline-none"
                  >
                    <option value="nfst">NFST (India Research)</option>
                    <option value="nos">NOS (Abroad Study)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Scheduled Tribe (ST)?</label>
                  <select
                    value={eligibilityCheck.stCategory}
                    onChange={e => setEligibilityCheck({ ...eligibilityCheck, stCategory: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs outline-none"
                  >
                    <option value="yes">Yes, I hold ST Certificate</option>
                    <option value="no">No / Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Post-Graduation Marks (%)</label>
                  <input
                    type="number"
                    value={eligibilityCheck.pgMarks}
                    onChange={e => setEligibilityCheck({ ...eligibilityCheck, pgMarks: e.target.value })}
                    placeholder="e.g. 65"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Annual Family Income (₹)</label>
                  <input
                    type="number"
                    value={eligibilityCheck.income}
                    onChange={e => setEligibilityCheck({ ...eligibilityCheck, income: e.target.value })}
                    placeholder="e.g. 240000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <button
                  onClick={handleCheckEligibility}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-colors"
                >
                  Verify My Eligibility
                </button>

                {eligibilityResult && (
                  <div className="flex-1 text-xs">
                    {eligibilityResult === 'ELIGIBLE_NFST' && (
                      <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-lg flex items-center justify-between">
                        <span>
                          🎉 <strong>Eligible for NFST!</strong> You meet the 55% PG threshold with ST status. Monthly stipend: ₹31,000.
                        </span>
                        <Link href="/apply?scheme=nfst" className="font-bold underline text-emerald-800 ml-2">
                          Apply Now →
                        </Link>
                      </div>
                    )}
                    {eligibilityResult === 'ELIGIBLE_NOS' && (
                      <div className="p-3 bg-blue-50 text-blue-900 border border-blue-300 rounded-lg flex items-center justify-between">
                        <span>
                          🎉 <strong>Eligible for NOS!</strong> You meet the 60% PG threshold & income ceiling (≤ ₹6L).
                        </span>
                        <Link href="/apply?scheme=nos" className="font-bold underline text-blue-800 ml-2">
                          Apply Now →
                        </Link>
                      </div>
                    )}
                    {eligibilityResult === 'NOT_ELIGIBLE_ST' && (
                      <div className="p-3 bg-rose-50 text-rose-900 border border-rose-300 rounded-lg">
                        ⚠️ These schemes are exclusively reserved for Scheduled Tribe (ST) candidates as mandated by MoTA.
                      </div>
                    )}
                    {eligibilityResult === 'INCOME_HIGH_NOS' && (
                      <div className="p-3 bg-amber-50 text-amber-900 border border-amber-300 rounded-lg">
                        ⚠️ NOS scheme requires family income not exceeding ₹6,00,000 p.a. You can still apply for NFST (no income cap)!
                      </div>
                    )}
                    {eligibilityResult.startsWith('MARKS_LOW') && (
                      <div className="p-3 bg-rose-50 text-rose-900 border border-rose-300 rounded-lg">
                        ⚠️ Minimum PG marks requirement not met (55% for NFST / 60% for NOS).
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </>
      )}

      {/* 5. Technical Approach Pillars (Slide 3 & 4) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Systematic Viability & Safeguard Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {t.techPillarsTitle}
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Native DPI integration reduces verification latency from 60 days to under 48 hours,
            while strict Human-in-the-Loop oversight prevents unfair denials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-4">
              1
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-2">{t.pillar1Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.pillar1Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold mb-4">
              2
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-2">{t.pillar2Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.pillar2Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-purple-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-4">
              3
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-2">{t.pillar3Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{t.pillar3Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-indigo-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold mb-4">
              4
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-2">{(t as any).pillar4Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{(t as any).pillar4Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-4">
              5
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-2">{(t as any).pillar5Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{(t as any).pillar5Desc}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-rose-400 transition-all">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-4">
              6
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-2">{(t as any).pillar6Title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{(t as any).pillar6Desc}</p>
          </div>
        </div>
      </section>

      {/* 6. SIH Judges Live Evaluation Fast-Tracks */}
      <section className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 pb-4 border-b border-slate-800 gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800">
                LIVE DEMO DASHBOARD SHORTCUTS
              </span>
              <h3 className="text-xl font-black mt-2">Experience Every Persona in 1-Click</h3>
              <p className="text-xs text-slate-400">
                Instant interactive access to Student Wizard, Scrutiny Officer Queue, Selection Committee, and MoTA Analytics.
              </p>
            </div>
            <div className="text-right text-xs text-slate-400 font-mono">
              MoTA Sovereign System
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/apply"
              className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 p-4 rounded-xl text-left transition-all group"
            >
              <div className="text-xs font-bold text-emerald-400 mb-1">1. Student Portal</div>
              <div className="text-sm font-bold text-white group-hover:text-amber-300">
                Application Wizard
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Test guided form, in-browser edge blur filter, and simulated OCR.
              </p>
            </Link>

            <Link
              href="/portal"
              className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 p-4 rounded-xl text-left transition-all group"
            >
              <div className="text-xs font-bold text-amber-400 mb-1">2. Deficiency Resolution</div>
              <div className="text-sm font-bold text-white group-hover:text-amber-300">
                1-Click Document Fix
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                View Vipin Gond's flagged deficiency and test instant re-upload flow.
              </p>
            </Link>

            <Link
              href="/admin"
              className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 p-4 rounded-xl text-left transition-all group"
            >
              <div className="text-xs font-bold text-blue-400 mb-1">3. Scrutiny Officer</div>
              <div className="text-sm font-bold text-white group-hover:text-amber-300">
                Spotlight Review UI
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Dual-pane document preview, Jaro-Winkler scores, and 30-second verification.
              </p>
            </Link>

            <Link
              href="/admin/analytics"
              className="bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 p-4 rounded-xl text-left transition-all group"
            >
              <div className="text-xs font-bold text-purple-400 mb-1">4. MoTA Leadership</div>
              <div className="text-sm font-bold text-white group-hover:text-amber-300">
                Executive Analytics
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Est. ₹1.80 Cr / year savings counter, state-wise breakdowns, and PFMS tracking.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. SIH Team Details Section: Parallaxx_24951A05M7 (Team ID: 171647) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 inline-block mb-1">
                SIH 2026 PROJECT TEAM SPECIFICATION
              </span>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Users2 className="w-6 h-6 text-emerald-600" />
                <span>Team: Parallaxx_24951A05M7</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Official Smart India Hackathon 2026 Team Details
              </p>
            </div>

            <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-mono font-bold">
              Team ID: <span className="text-amber-400">171647</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Bhimavarapu Navya Sri', role: 'Team Leader', color: 'bg-amber-600', avatar: 'NS' },
              { name: 'B P S Kruthi', role: 'Team Member', color: 'bg-emerald-600', avatar: 'BK' },
              { name: 'Navadeep Vandhanapu', role: 'Team Member', color: 'bg-blue-600', avatar: 'NV' },
              { name: 'Navadeep Chandanam', role: 'Team Member', color: 'bg-indigo-600', avatar: 'NC' },
              { name: 'D Nilesh Choudhary', role: 'Team Member', color: 'bg-purple-600', avatar: 'NC' },
              { name: 'Chirra Karthika', role: 'Team Member', color: 'bg-rose-600', avatar: 'CK' }
            ].map((member, idx) => (
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
      </section>
    </div>
  );
}
