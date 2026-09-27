'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import {
  GraduationCap,
  Mail,
  Lock,
  Phone,
  User as UserIcon,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  X,
  Inbox
} from 'lucide-react';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { switchUser } = useLanguage();

  const rawRedirect = searchParams.get('redirect');
  const decodedRedirect = rawRedirect ? decodeURIComponent(rawRedirect) : null;

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  // OTP Verification state
  const [step, setStep] = useState<'FORM' | 'OTP_VERIFY'>('FORM');
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [inputOtp, setInputOtp] = useState('');
  const [emailDrawerOpen, setEmailDrawerOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [realEmailSent, setRealEmailSent] = useState(false);

  // Trigger OTP Generation & Email Sending
  const handleInitiateSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: code,
          firstName: firstName.trim(),
          lastName: lastName.trim()
        })
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to send OTP email');
        return;
      }

      setRealEmailSent(!!data.emailSent);
      setStep('OTP_VERIFY');
    } catch (err: any) {
      setLoading(false);
      setError(`Failed to send OTP email: ${err.message}`);
    }
  };

  // Submit OTP and create account
  const handleVerifyOtpAndCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (inputOtp.trim() !== generatedOtp) {
      setError('Invalid OTP code. Please check your email inbox for the 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          mobile,
          password
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Auto-log in student
      await switchUser(data.user);

      if (decodedRedirect) {
        router.push(decodedRedirect);
      } else {
        router.push('/portal');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        {/* Left Side Info & Sovereign Student Notice */}
        <div className="bg-slate-900 text-white p-8 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold border border-emerald-500/30">
              <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Student Registration Gateway</span>
            </div>

            <h2 className="text-2xl font-black">National ST Scholar Registration</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Create your sovereign student account to apply for NFST (National Fellowship for ST Students)
              and NOS (National Overseas Scholarship).
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>48-Hour Fast-Track Document Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Direct PFMS Monthly Fellowship Disbursal</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero-Trust Aadhaar & Caste Certificate Validation</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-400">
            Official Ministry Portal • Sovereign ST Fellowship Administration
          </div>
        </div>

        {/* Right Side: Signup Form or OTP Input */}
        <div className="p-8 space-y-6 flex flex-col justify-between">
          {step === 'FORM' ? (
            <form onSubmit={handleInitiateSignup} className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Create Student Account</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your official details to register for MoTA Fellowships
                </p>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">First Name</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      placeholder="Rahul"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    placeholder="Munda"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="rahul.munda@scholar.in"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Mobile Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={e => setMobile(e.target.value)}
                    placeholder="9876543210"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Create secure password"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20"
              >
                <span>Send 6-Digit OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Step 2: OTP Verification */
            <form onSubmit={handleVerifyOtpAndCreate} className="space-y-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Step 2 of 2: Email Verification
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">Enter 6-Digit OTP</h3>
                <p className="text-xs text-slate-500 mt-1">
                  We sent a simulated 6-digit OTP code to <strong>{email}</strong>.
                </p>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Email Inbox Notice Banner */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  <span>Verification Email Dispatched</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  A 6-digit OTP code has been sent to <strong>{email}</strong>. Please check your email inbox and enter the verification code below.
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">6-Digit Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={inputOtp}
                  onChange={e => setInputOtp(e.target.value)}
                  placeholder="e.g. 784920"
                  className="w-full py-3 px-3 text-center tracking-widest font-mono text-lg font-black bg-slate-50 border-2 border-emerald-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStep('FORM')}
                  className="w-1/3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <span>{loading ? 'Creating Account...' : 'Verify & Complete Signup'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Footer Login Link */}
          <div className="pt-4 border-t border-slate-200 text-center">
            <p className="text-xs text-slate-600">
              Already registered?{' '}
              <Link
                href={
                  rawRedirect
                    ? `/login?redirect=${encodeURIComponent(rawRedirect)}`
                    : '/login'
                }
                className="font-bold text-emerald-700 hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-slate-500">Loading Registration Portal...</div>}>
      <SignupContent />
    </Suspense>
  );
}
