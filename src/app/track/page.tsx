'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import { StatusStepper } from '@/components/StatusStepper';
import { Application } from '@/lib/types';
import {
  Search,
  FileCheck,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Building,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

function TrackContent() {
  const { t, lang, currentUser } = useLanguage();
  const searchParams = useSearchParams();
  const urlParamId = searchParams.get('id');

  const [searchId, setSearchId] = useState<string>(urlParamId || '');
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplicationById = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/applications/${id}`);
      const data = await res.json();
      if (data.success && data.application) {
        setApplication(data.application);
      } else {
        setError(`Application ID "${id}" was not found. Please verify the ID.`);
        setApplication(null);
      }
    } catch (e: any) {
      setError(e.message || 'Error retrieving application records.');
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  const loadInitialTracker = async () => {
    setLoading(true);
    setError(null);

    // 1. If an explicit ?id= query param is provided, load that exact application ID
    if (urlParamId) {
      fetchApplicationById(urlParamId);
      return;
    }

    // 2. If a student is logged in, check if they have submitted any applications
    if (currentUser && currentUser.role === 'APPLICANT') {
      try {
        const res = await fetch(`/api/applications?applicantId=${currentUser.id}`);
        const data = await res.json();
        let userApps: Application[] = [];

        if (data.success && data.applications.length > 0) {
          userApps = data.applications;
        } else if (currentUser.email) {
          const allRes = await fetch('/api/applications');
          const allData = await allRes.json();
          if (allData.success) {
            userApps = allData.applications.filter(
              (a: Application) =>
                a.applicantId === currentUser.id ||
                (a.formData?.emailAddress &&
                  a.formData.emailAddress.toLowerCase().trim() === currentUser.email.toLowerCase().trim())
            );
          }
        }

        if (userApps.length > 0) {
          setSearchId(userApps[0].id);
          setApplication(userApps[0]);
        } else {
          // New student account with 0 applications: DO NOT show pre-seeded accounts!
          setApplication(null);
          setSearchId('');
        }
      } catch (e) {
        console.error(e);
        setApplication(null);
      } finally {
        setLoading(false);
      }
      return;
    }

    // 3. Guest user with no ID query param: show blank search state
    setApplication(null);
    setSearchId('');
    setLoading(false);
  };

  useEffect(() => {
    loadInitialTracker();
  }, [urlParamId, currentUser]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      fetchApplicationById(searchId.trim());
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
      {/* Header & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl mb-6">
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-300">
            SOVEREIGN 5-STAGE LIFECYCLE TRACKER
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-2">
            Track Application Status in Real-Time
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            48-Hour SLA processing timeline with live audit trail, PFMS disbursement records, and deficiency notices.
          </p>
        </div>

        {/* Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              placeholder="Enter Application ID (e.g. MOTA-NFST-2025-0104)"
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors shrink-0 shadow-sm"
          >
            Track Status
          </button>
        </form>

        {/* Quick Demo Pre-selected IDs for Hackathon Judges */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Quick Demo Samples:</span>
          <button
            onClick={() => { setSearchId('MOTA-NFST-2025-0104'); fetchApplicationById('MOTA-NFST-2025-0104'); }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md font-mono text-[11px] border border-slate-200"
          >
            MOTA-NFST-2025-0104 (Verified)
          </button>
          <button
            onClick={() => { setSearchId('MOTA-NOS-2025-0012'); fetchApplicationById('MOTA-NOS-2025-0012'); }}
            className="bg-purple-50 hover:bg-purple-100 text-purple-800 px-2.5 py-1 rounded-md font-mono text-[11px] border border-purple-200"
          >
            MOTA-NOS-2025-0012 (Shortlisted Abroad)
          </button>
          <button
            onClick={() => { setSearchId('MOTA-NFST-2025-0219'); fetchApplicationById('MOTA-NFST-2025-0219'); }}
            className="bg-amber-50 hover:bg-amber-100 text-amber-800 px-2.5 py-1 rounded-md font-mono text-[11px] border border-amber-200"
          >
            MOTA-NFST-2025-0219 (Deficiency Flagged)
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold">Fetching sovereign verification records...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-rose-900 text-sm">
          <div className="flex items-center gap-2 font-bold mb-1">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Application Not Found</span>
          </div>
          <p className="text-xs text-rose-700">{error}</p>
        </div>
      )}

      {/* Empty State for New Account with 0 Applications */}
      {!loading && !application && !error && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
            <Search className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-black text-slate-900">
              {currentUser ? `No Active Applications for ${currentUser.name}` : 'Track Application Status'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {currentUser
                ? "You haven't submitted any scholarship applications yet. Enter an Application ID above to search, or start a new application below."
                : "Enter your Application ID (e.g. MOTA-NFST-2025-XXXX) in the search bar above to track real-time status."}
            </p>
          </div>

          {currentUser && currentUser.role === 'APPLICANT' && (
            <div className="pt-2">
              <Link
                href="/apply"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5"
              >
                <span>Start Scholarship Application &rarr;</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Application Details & 5-Stage Stepper */}
      {application && !loading && (
        <div className="space-y-6">
          {/* Status Stepper & PPT 5-Stage Lifecycle Ribbon */}
          <StatusStepper
            status={application.status}
            lifecycleStage={application.currentLifecycleStage}
            submittedAt={application.submittedAt}
            updatedAt={application.updatedAt}
            hasDeficiency={application.status === 'DEFICIENCY_FLAGGED'}
            pfmsUtr={application.formData.pfmsUtrNumber}
          />

          {/* Deficiency Notice Alert (if applicable) with 1-Click Fix */}
          {application.deficiencyNotices.length > 0 && !application.deficiencyNotices[0].resolved && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider bg-amber-100 px-2 py-0.5 rounded">
                      Action Required: Deficiency Noticed
                    </span>
                    <h3 className="text-base font-bold text-amber-950 mt-1">
                      {application.deficiencyNotices[0].title}
                    </h3>
                    <p className="text-xs text-amber-900 mt-1 leading-relaxed">
                      {application.deficiencyNotices[0].reason}
                    </p>
                    <p className="text-xs text-amber-800 mt-2 font-medium">
                      <strong>Required Action:</strong> {application.deficiencyNotices[0].suggestedAction}
                    </p>
                    <p className="text-[11px] text-amber-700 font-mono mt-1">
                      Flagged by: {application.deficiencyNotices[0].flaggedBy} on{' '}
                      {new Date(application.deficiencyNotices[0].flaggedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <Link
                  href="/portal"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 inline-flex items-center gap-1.5"
                >
                  <span>Resolve & Re-Upload Document</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Candidate & Scheme Overview */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 md:col-span-2">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs text-slate-500 font-mono">SCHOLAR DETAILS</span>
                  <h3 className="text-lg font-bold text-slate-900">{application.applicantName}</h3>
                  <div className="text-xs text-slate-600 font-medium">
                    Community: <strong className="text-blue-900">{application.applicantTribe} (Scheduled Tribe)</strong> • State: {application.applicantState}
                  </div>
                </div>
                <span className="bg-blue-50 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                  {application.schemeCode}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Application ID</span>
                  <span className="font-bold font-mono text-slate-900">{application.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Jaro-Winkler Similarity</span>
                  <span className="font-bold text-emerald-700 font-mono">{application.avgJaroWinklerScore}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Edge Blur Gate (IQA)</span>
                  <span className="font-bold text-emerald-700">{application.edgeIqaStatus}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Qualifying Exam</span>
                  <span className="font-bold text-slate-900">{application.formData.qualifyingExam}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Annual Family Income</span>
                  <span className="font-bold text-slate-900">₹{application.formData.annualFamilyIncome.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Merit Score</span>
                  <span className="font-bold text-purple-700">{application.meritScore} / 100</span>
                </div>
              </div>

              {/* Research or Overseas University */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <span className="text-slate-500 font-semibold block mb-1">
                  {application.schemeCode === 'NOS' ? 'Foreign University & Degree' : 'Indian University & Research Synopsis'}
                </span>
                <p className="font-bold text-slate-900">
                  {application.schemeCode === 'NOS'
                    ? `${application.formData.foreignUniversityName} (QS Rank #${application.formData.qsWorldRanking})`
                    : application.formData.phdEnrolledUniversity}
                </p>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  {application.schemeCode === 'NOS'
                    ? application.formData.foreignCourseName
                    : `Topic: “${application.formData.researchTopicTitle}”`}
                </p>
              </div>
            </div>

            {/* PFMS DBT Rail & Banking Status */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                    PFMS DBT Rail Status
                  </h4>
                </div>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Aadhaar Seeded
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Bank Name</span>
                  <span className="font-bold text-slate-900">{application.formData.bankName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Account (Masked)</span>
                  <span className="font-bold font-mono text-slate-900">
                    XXXX-XXXX-{(application.formData.bankAccountNumber || application.formData.bankAccountNo || '4921').slice(-4)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">PFMS Beneficiary Code</span>
                  <span className="font-mono text-slate-700">
                    {application.formData.pfmsBeneficiaryCode || 'PFMS-ST-PENDING'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">PFMS Disbursement UTR</span>
                  <span className="font-mono font-bold text-blue-700">
                    {application.formData.pfmsUtrNumber || 'Awaiting Selection List Sanction'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200">
                  ✓ Direct Benefit Transfer directly connects to the National Payments Corporation of India (NPCI) mapper.
                </div>
              </div>
            </div>
          </div>

          {/* Verification Audit Log Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Immutable Verification Audit Trail (DPDP Compliant)</span>
            </h4>

            <div className="space-y-3">
              {application.verificationLogs.map((log, lIdx) => (
                <div key={lIdx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className="font-bold text-slate-900">
                        {log.action.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-600">{log.details}</p>
                    <span className="text-[10px] text-slate-400 font-medium">
                      By: {log.officerName} ({log.officerRole})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto p-12 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold">Loading status tracker...</p>
        </div>
      }
    >
      <TrackContent />
    </Suspense>
  );
}
