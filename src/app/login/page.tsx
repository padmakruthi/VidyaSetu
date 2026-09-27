'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import { UserRole } from '@/lib/types';
import {
  ShieldCheck,
  UserCheck,
  Lock,
  Mail,
  ArrowRight,
  GraduationCap,
  Building2,
  Users,
  FileCheck2,
  BarChart3,
  Sparkles,
  AlertCircle
} from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { switchUser } = useLanguage();

  const rawRedirect = searchParams.get('redirect');
  const decodedRedirect = rawRedirect ? decodeURIComponent(rawRedirect) : null;

  const [loginType, setLoginType] = useState<'STUDENT' | 'ADMIN'>('STUDENT');
  const [selectedAdminRole, setSelectedAdminRole] = useState<UserRole>('SELECTION_COMMITTEE');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          loginType,
          selectedAdminRole
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Update client context
      await switchUser(data.user);

      // Route based on redirect param or role
      if (decodedRedirect) {
        router.push(decodedRedirect);
      } else if (loginType === 'ADMIN') {
        if (selectedAdminRole === 'SCRUTINY_OFFICER') {
          router.push('/admin');
        } else if (selectedAdminRole === 'SELECTION_COMMITTEE') {
          router.push('/admin/selection');
        } else {
          router.push('/admin/analytics');
        }
      } else {
        router.push('/portal');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
      setLoading(false);
    }
  };

  const handleFillSeed = (seedEmail: string, role?: UserRole) => {
    setEmail(seedEmail);
    setPassword('Password@123');
    setError(null);
    if (role) {
      setLoginType('ADMIN');
      setSelectedAdminRole(role);
    } else {
      setLoginType('STUDENT');
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Left Side: Brand & Ministry Information */}
        <div className="bg-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-mono font-bold border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Ministry of Tribal Affairs • Government of India</span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-linear-to-b from-amber-600 via-amber-700 to-amber-900 text-white font-serif font-black flex items-center justify-center text-sm border-2 border-amber-300 shadow-md">
                सत्य
              </div>
              <div>
                <h2 className="text-xl font-black tracking-tight">VIDYASETU (विद्यासेतु)</h2>
                <p className="text-xs text-slate-400 font-medium">Ministry of Tribal Affairs • Govt. of India</p>
              </div>
            </div>

            <p className="text-amber-300 font-serif italic text-sm">
              “Har Vidyarthi Ka, Safalta Ka Marg”
            </p>

            <p className="text-xs text-slate-300 leading-relaxed pt-2">
              Single sovereign authentication gateway for Scheduled Tribe scholars and Ministry officials.
              Supports zero-trust verification and direct PFMS stipend tracking.
            </p>
          </div>

          {/* Quick Pre-Seeded Accounts for Demo Evaluator */}
          <div className="relative z-10 pt-6 border-t border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
              Pre-Seeded Demo Evaluator Quick-Fill:
            </span>

            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => handleFillSeed('committee.tirkey@mota.gov.in', 'SELECTION_COMMITTEE')}
                className="text-left bg-slate-800/90 hover:bg-purple-900/60 text-purple-200 p-2 rounded-lg border border-purple-500/30 transition-colors"
              >
                <div className="font-bold">Prof. Kamala Tirkey</div>
                <div className="text-[10px] text-purple-300/80">Selection Committee</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillSeed('officer.scrutiny@mota.gov.in', 'SCRUTINY_OFFICER')}
                className="text-left bg-slate-800/90 hover:bg-blue-900/60 text-blue-200 p-2 rounded-lg border border-blue-500/30 transition-colors"
              >
                <div className="font-bold">Dr. Rajeshwar Rao</div>
                <div className="text-[10px] text-blue-300/80">Scrutiny Officer</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillSeed('admin.director@mota.gov.in', 'ADMIN')}
                className="text-left bg-slate-800/90 hover:bg-emerald-900/60 text-emerald-200 p-2 rounded-lg border border-emerald-500/30 transition-colors"
              >
                <div className="font-bold">Smt. Ananya Sen</div>
                <div className="text-[10px] text-emerald-300/80">MoTA Admin</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillSeed('arun.soren@scholar.in')}
                className="text-left bg-slate-800/90 hover:bg-amber-900/60 text-amber-200 p-2 rounded-lg border border-amber-500/30 transition-colors"
              >
                <div className="font-bold">Arun Soren</div>
                <div className="text-[10px] text-amber-300/80">Student Applicant</div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form with Persona Tabs */}
        <div className="p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900">Sign In to VidyaSetu</h3>
              <p className="text-xs text-slate-500 mt-1">
                {decodedRedirect ? (
                  <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                    Please sign in to access your requested destination
                  </span>
                ) : (
                  'Select your persona type below to access your portal'
                )}
              </p>
            </div>

            {/* Persona Login Tabs */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setLoginType('STUDENT');
                  setError(null);
                }}
                className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  loginType === 'STUDENT'
                    ? 'bg-white text-emerald-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Login as Student</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginType('ADMIN');
                  setError(null);
                }}
                className={`py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  loginType === 'ADMIN'
                    ? 'bg-white text-purple-700 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Login as Admin</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Admin Role Selector Dropdown (Sole Source of Truth for Routing) */}
              {loginType === 'ADMIN' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-purple-900 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-purple-600" />
                    <span>Select Official Admin Role:</span>
                  </label>
                  <select
                    value={selectedAdminRole}
                    onChange={e => setSelectedAdminRole(e.target.value as UserRole)}
                    className="w-full bg-purple-50/60 border border-purple-200 text-purple-950 font-bold text-xs rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                  >
                    <option value="SCRUTINY_OFFICER">
                      Dr. Rajeshwar Rao — Scrutiny Officer (Scrutiny Queue)
                    </option>
                    <option value="SELECTION_COMMITTEE">
                      Prof. Kamala Tirkey — Selection Committee (Merit Dashboard)
                    </option>
                    <option value="ADMIN">
                      Smt. Ananya Sen, IAS — MoTA Admin (Analytics Dashboard)
                    </option>
                  </select>
                </div>
              )}

              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={loginType === 'STUDENT' ? 'arun.soren@scholar.in' : 'officer.email@mota.gov.in'}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password (Default: Password@123)"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-xs text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                  loginType === 'ADMIN'
                    ? 'bg-purple-700 hover:bg-purple-800 shadow-purple-900/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'
                }`}
              >
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Footer Signup Link */}
          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              Don't have a student account?{' '}
              <Link
                href={
                  rawRedirect
                    ? `/signup?redirect=${encodeURIComponent(rawRedirect)}`
                    : '/signup'
                }
                className="font-bold text-emerald-700 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-slate-500">Loading Login Portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}
