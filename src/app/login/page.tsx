'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import { initialUsers } from '@/lib/store';
import {
  ShieldCheck,
  UserCheck,
  Smartphone,
  Lock,
  ArrowRight,
  Sparkles,
  Award,
  Users2,
  Building
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { switchUser, lang, t } = useLanguage();
  const [mobileOrEmail, setMobileOrEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleQuickLogin = async (user: any) => {
    await switchUser(user);
    if (user.role === 'APPLICANT') {
      router.push('/portal');
    } else if (user.role === 'SCRUTINY_OFFICER') {
      router.push('/admin');
    } else if (user.role === 'SELECTION_COMMITTEE') {
      router.push('/admin/selection');
    } else {
      router.push('/admin/analytics');
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileOrEmail.trim()) {
      setOtpSent(true);
      setOtp('4921'); // Simulated OTP
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    // Default to Arun Soren on simulated OTP login
    const target = initialUsers[0];
    await switchUser(target);
    router.push('/portal');
  };

  return (
    <div className="flex-1 bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Left Side: Brand & SIH Info */}
        <div className="bg-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-mono font-bold border border-white/10">
              <span>SIH 2026 • Team parllaxx_24951A05M7</span>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-amber-700 text-white font-serif font-black flex items-center justify-center text-sm border border-amber-300 shadow-sm">
                सत्य
              </div>
              <div>
                <h2 className="text-xl font-black">VIDYASETU (विद्यासेतु)</h2>
                <p className="text-xs text-slate-400">Ministry of Tribal Affairs</p>
              </div>
            </div>

            <p className="text-amber-300 font-serif italic text-sm">
              “Har Vidyarthi Ka, Safalta Ka Marg”
            </p>

            <p className="text-xs text-slate-300 leading-relaxed pt-2">
              Single sovereign window connecting Scheduled Tribe scholars with 48-Hour digital scrutiny,
              zero-trust identity validation, and direct bank PFMS DBT rails.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>DPDP Act 2023 & MeriPehchan Single Sign-On Aligned</span>
            </div>
            <div>Helpline Desk: 1800-11-7777 (Toll Free)</div>
          </div>
        </div>

        {/* Right Side: Role Quick-Select & Login */}
        <div className="p-8 space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Select Role / Login Persona
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              1-Click instant login for hackathon evaluation or mobile OTP simulation.
            </p>
          </div>

          {/* Quick Select Personas */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              1-Click Demo Evaluation Profiles
            </span>

            {/* Arun */}
            <button
              onClick={() => handleQuickLogin(initialUsers[0])}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs">
                  AS
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-emerald-900">
                    Arun Soren (Applicant - NFST Verified)
                  </div>
                  <div className="text-[10px] text-slate-500">Santhal Tribe • Odisha • JNU Ph.D</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
            </button>

            {/* Sunita */}
            <button
              onClick={() => handleQuickLogin(initialUsers[1])}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">
                  SM
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-purple-900">
                    Sunita Munda (Applicant - NOS Shortlisted)
                  </div>
                  <div className="text-[10px] text-slate-500">Munda Tribe • Imperial College London Ph.D</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
            </button>

            {/* Vipin */}
            <button
              onClick={() => handleQuickLogin(initialUsers[2])}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xs">
                  VG
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-amber-900">
                    Vipin Kumar Gond (Deficiency Flagged)
                  </div>
                  <div className="text-[10px] text-slate-500">Gond Tribe • Mandla MP • Test 1-Click Fix</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
            </button>

            {/* Dr Rao */}
            <button
              onClick={() => handleQuickLogin(initialUsers[3])}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs">
                  RR
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-blue-900">
                    Dr. Rajeshwar Rao (Scrutiny Officer)
                  </div>
                  <div className="text-[10px] text-slate-500">Spotlight UI • 30-Sec Document Review</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
            </button>

            {/* Prof Tirkey */}
            <button
              onClick={() => handleQuickLogin(initialUsers[4])}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-purple-500 hover:bg-purple-50/50 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 font-bold flex items-center justify-center text-xs">
                  KT
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900 group-hover:text-purple-900">
                    Prof. Kamala Tirkey (Selection Committee)
                  </div>
                  <div className="text-[10px] text-slate-500">Merit Shortlists & Human Override</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
            </button>

            {/* Smt Sen IAS */}
            <button
              onClick={() => handleQuickLogin(initialUsers[5])}
              className="w-full text-left p-2.5 rounded-xl border border-slate-200 hover:border-slate-800 hover:bg-slate-100 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center text-xs">
                  AS
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">
                    Smt. Ananya Sen, IAS (MoTA Admin)
                  </div>
                  <div className="text-[10px] text-slate-500">Executive Analytics & Rulebook Engine</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900" />
            </button>
          </div>

          {/* Simple Mobile OTP Login Option for First-Gen Rural Users */}
          <div className="pt-4 border-t border-slate-200">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Citizen Mobile OTP Login
            </span>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={mobileOrEmail}
                    onChange={e => setMobileOrEmail(e.target.value)}
                    placeholder="Enter 10-Digit Mobile / Email"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  Send OTP via SMS
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-3">
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
                  Simulated OTP <strong>4921</strong> sent to {mobileOrEmail}.
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter 4-Digit OTP"
                  className="w-full py-2 px-3 text-center tracking-widest font-mono font-bold bg-slate-50 border border-slate-300 rounded-xl text-sm outline-none"
                />
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  Verify & Enter Portal
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
