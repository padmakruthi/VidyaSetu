'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { Application } from '@/lib/types';
import { rankNosApplications, rankNfstApplications, RankedNosApplication, RankedNfstApplication } from '@/lib/ranking';
import {
  Award,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Edit3,
  X,
  FileCheck,
  RefreshCw,
  MessageSquare,
  Flag,
  Mail,
  Send,
  Sparkles,
  Clock,
  GraduationCap,
  Globe2,
  Building2,
  Check,
  Ban
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SelectionCommitteePage() {
  const { currentUser } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'NOS' | 'NFST'>('NOS');

  // Modals state
  const [remarkModalApp, setRemarkModalApp] = useState<Application | null>(null);
  const [remarkText, setRemarkText] = useState<string>('');

  const [scrutinyModalApp, setScrutinyModalApp] = useState<Application | null>(null);
  const [scrutinyReason, setScrutinyReason] = useState<string>('Document validity requires further verification by Scrutiny Officer.');

  // Flag / Rejection Preset Reasons
  const REASON_PRESETS = [
    {
      id: 'INCONSISTENCY',
      label: '2. Inconsistencies of details in documents',
      defaultRemark: 'Discrepancies detected between submitted form details and uploaded certificates (e.g. name spelling mismatch, DOB error, or category discrepancy).'
    },
    {
      id: 'ELIGIBILITY',
      label: '1. Did not meet eligibility criteria',
      defaultRemark: 'Applicant does not meet the statutory scheme eligibility criteria (e.g. annual family income ceiling, qualifying marks threshold, or age limit).'
    },
    {
      id: 'REUPLOAD',
      label: '3. Documents need to be uploaded again',
      defaultRemark: 'Uploaded document scan is blurry, expired, or unreadable. Fresh valid certificates must be uploaded.'
    },
    {
      id: 'CUSTOM',
      label: '4. Custom Committee Remark',
      defaultRemark: 'Requires specific review by Selection Committee / Scrutiny Officers.'
    }
  ];

  const [flagReasonCategory, setFlagReasonCategory] = useState<string>('INCONSISTENCY');
  const [committeeRemarkText, setCommitteeRemarkText] = useState<string>(
    'Discrepancies detected between submitted form details and uploaded certificates (e.g. name spelling mismatch, DOB error, or category discrepancy).'
  );

  const handleReasonPresetChange = (presetId: string) => {
    setFlagReasonCategory(presetId);
    const found = REASON_PRESETS.find(p => p.id === presetId);
    if (found) {
      setCommitteeRemarkText(found.defaultRemark);
      setScrutinyReason(found.defaultRemark);
    }
  };

  // Simulated Email Notification Drawer State
  const [emailDrawerOpen, setEmailDrawerOpen] = useState<boolean>(false);
  const [emailType, setEmailType] = useState<'SELECTED' | 'NOT_SELECTED'>('SELECTED');
  const [targetEmailApp, setTargetEmailApp] = useState<Application | null>(null);
  const [emailSending, setEmailSending] = useState<boolean>(false);
  const [emailSentSuccess, setEmailSentSuccess] = useState<boolean>(false);

  const isAuthorized = currentUser && ['SELECTION_COMMITTEE', 'ADMIN'].includes(currentUser.role);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchApplications();
    }
  }, [isAuthorized]);

  // Role-Match Enforcement Guard (Requirement #3)
  if (!currentUser || currentUser.role === 'APPLICANT') {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-lg text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-2xl font-black text-slate-900">Access Restricted</h2>
        <p className="text-xs text-slate-600">
          This Selection Committee dashboard is restricted to authorized committee members (Prof. Kamala Tirkey).
        </p>
        <Link
          href={`/login?redirect=${encodeURIComponent('/admin/selection')}`}
          className="inline-block bg-purple-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md"
        >
          Sign In as Selection Committee
        </Link>
      </div>
    );
  }

  if (currentUser.role === 'SCRUTINY_OFFICER') {
    return (
      <div className="max-w-4xl mx-auto my-12 p-8 bg-white border border-purple-200 rounded-2xl shadow-lg text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-purple-600 mx-auto" />
        <h2 className="text-2xl font-black text-slate-900">Access Restricted: Scrutiny Officer Persona</h2>
        <p className="text-xs text-slate-600">
          You are currently logged in as <strong>Dr. Rajeshwar Rao (Scrutiny Officer)</strong>. You do not have permission to access the Selection Committee merit dashboard.
        </p>
        <Link
          href="/admin"
          className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md"
        >
          Go to Your Dashboard: Scrutiny Queue &rarr;
        </Link>
      </div>
    );
  }

  const rankedNos = rankNosApplications(applications);
  const rankedNfst = rankNfstApplications(applications);

  // Committee Action Handlers
  const handleSaveRemark = async () => {
    if (!remarkModalApp || !remarkText.trim()) return;
    try {
      const res = await fetch(`/api/applications/${remarkModalApp.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'ADD_REMARK',
          officerName: currentUser.name,
          officerRole: 'SELECTION_COMMITTEE',
          remarks: remarkText
        })
      });
      const data = await res.json();
      if (data.success) {
        setRemarkModalApp(null);
        setRemarkText('');
        fetchApplications();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFlagScrutiny = async () => {
    if (!scrutinyModalApp) return;
    try {
      const categoryLabel = REASON_PRESETS.find(p => p.id === flagReasonCategory)?.label || 'Scrutiny Flag';
      const finalRemark = committeeRemarkText.trim() || scrutinyReason;

      const res = await fetch(`/api/applications/${scrutinyModalApp.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RAISE_DEFICIENCY',
          officerName: currentUser.name,
          officerRole: 'SELECTION_COMMITTEE',
          remarks: `[${categoryLabel}] ${finalRemark}`,
          data: {
            title: categoryLabel,
            reason: finalRemark,
            suggestedAction: flagReasonCategory === 'REUPLOAD'
              ? 'Please re-upload a clear and valid document on the portal.'
              : 'Log in to portal to check deficiency details or book an office visit.'
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setScrutinyModalApp(null);
        fetchApplications();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenEmailDrawer = (app: Application, type: 'SELECTED' | 'NOT_SELECTED') => {
    setTargetEmailApp(app);
    setEmailType(type);
    setEmailSentSuccess(false);
    setFlagReasonCategory('INCONSISTENCY');
    setCommitteeRemarkText('Discrepancies detected between submitted form details and uploaded certificates (e.g. name spelling mismatch, DOB error, or category discrepancy).');
    setEmailDrawerOpen(true);
  };

  const handleSimulateSendEmail = async () => {
    if (!targetEmailApp) return;
    setEmailSending(true);

    try {
      const actionName = emailType === 'SELECTED' ? 'AWARD_FELLOWSHIP' : 'RAISE_DEFICIENCY';
      const categoryLabel = REASON_PRESETS.find(p => p.id === flagReasonCategory)?.label || 'Committee Evaluation';
      
      const remarksText = emailType === 'SELECTED'
        ? 'Selection Committee approved award. Sanction order generated and automated email dispatched.'
        : `[${categoryLabel}] ${committeeRemarkText}`;

      const res = await fetch(`/api/applications/${targetEmailApp.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionName,
          officerName: currentUser.name,
          officerRole: 'SELECTION_COMMITTEE',
          remarks: remarksText,
          data: {
            title: categoryLabel,
            reason: committeeRemarkText,
            suggestedAction: flagReasonCategory === 'REUPLOAD'
              ? 'Please re-upload a clear and valid document on the portal.'
              : 'Log in to portal to check deficiency details or book an office visit.'
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setEmailSending(false);
        setEmailSentSuccess(true);
        fetchApplications();

        if (emailType === 'SELECTED') {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        }
      }
    } catch (e) {
      console.error(e);
      setEmailSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-purple-400 bg-purple-950/80 px-2.5 py-0.5 rounded border border-purple-800">
                MoTA SELECTION COMMITTEE BOARD
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                Panelist: {currentUser.name} (Prof. Kamala Tirkey)
              </span>
            </div>
            <h1 className="text-2xl font-black mt-2">
              Statutory Selection Committee & Quota Allocation Matrix
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Independent ranking engines for NOS Overseas and NFST Domestic Fellowships. Quotas, tiers, and tie-breakers enforced strictly per Ministry rules.
            </p>
          </div>

          {/* Scheme Switcher Tabs */}
          <div className="flex bg-slate-800 p-1.5 rounded-xl text-xs font-bold shrink-0 border border-slate-700">
            <button
              onClick={() => setActiveTab('NOS')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'NOS' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe2 className="w-4 h-4" />
              <span>NOS Overseas (20 Slots)</span>
            </button>

            <button
              onClick={() => setActiveTab('NFST')}
              className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                activeTab === 'NFST' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>NFST Domestic (750 Slots)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quota Tracking Summary Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Sovereign ST Quota
          </span>
          <div className="text-xl font-black text-slate-900">100% Guaranteed</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Presidential affirmative mandate</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Female Sub-Quota Floor
          </span>
          <div className="text-xl font-black text-purple-700">
            {activeTab === 'NOS' ? '30% Earmarked (6 Slots)' : '30% Earmarked (225 Slots)'}
          </div>
          <p className="text-[11px] text-purple-600 mt-0.5">Unfilled slots roll over to general ST</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            PVTG Affirmative Action
          </span>
          <div className="text-xl font-black text-emerald-600">
            {activeTab === 'NOS' ? '3 Reserved Slots' : '25 Reserved Slots'}
          </div>
          <p className="text-[11px] text-emerald-700 mt-0.5">Particularly Vulnerable Tribal Groups</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            PFMS Sanction Rail
          </span>
          <div className="text-xl font-black text-blue-600">Automated Award Notice</div>
          <p className="text-[11px] text-blue-700 mt-0.5">Simulated email dispatch on approval</p>
        </div>
      </div>

      {/* TAB 1: NOS OVERSEAS SHORTLIST */}
      {activeTab === 'NOS' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-purple-50/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-purple-100 text-purple-900 text-xs font-bold px-2.5 py-0.5 rounded border border-purple-300">
                  NOS RANKING MATRIX (20 SLOTS)
                </span>
                <span className="text-xs text-slate-600 font-mono">
                  Ceiling Limit: ≤ ₹6,00,000/year
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                National Overseas Scholarship Merit Roster
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Priority Rules: Tier 1 (Confirmed Offer with QS Rank) ➔ Tier 2 (GRE/IELTS Cleared) ➔ Tie-breaker by PG Marks (%) ➔ Reservation Overlay (17 General ST, 3 PVTG, 30% Female).
              </p>
            </div>

            <span className="text-xs font-mono font-bold bg-white text-purple-900 px-3 py-1.5 rounded-lg border border-purple-200 shadow-xs">
              Total Evaluated: {rankedNos.length} Candidates
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Rank</th>
                  <th className="py-3.5 px-4">Scholar Details</th>
                  <th className="py-3.5 px-4">Institutional Priority & Tier</th>
                  <th className="py-3.5 px-4">QS Rank / Exam</th>
                  <th className="py-3.5 px-4">PG Marks (%)</th>
                  <th className="py-3.5 px-4">Allocated Quota Status</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Committee Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 mx-auto mb-2 text-purple-600 animate-spin" />
                      Loading NOS priority shortlists...
                    </td>
                  </tr>
                ) : rankedNos.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No NOS applications currently in queue.
                    </td>
                  </tr>
                ) : (
                  rankedNos.map(item => {
                    const app = item.application;
                    const isAwarded = app.status === 'PROVISIONALLY_SELECTED';
                    const isRejected = app.status === 'REJECTED';
                    const isUnderScrutiny = app.status === 'UNDER_SCRUTINY';

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Rank */}
                        <td className="py-4 px-4">
                          <span
                            className={`w-7 h-7 rounded-full font-black flex items-center justify-center text-xs ${
                              item.isSelected
                                ? 'bg-purple-900 text-white shadow-xs'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            #{item.rank}
                          </span>
                        </td>

                        {/* Scholar Details */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{app.applicantName}</span>
                            {app.isPvtg && (
                              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                PVTG
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {app.id} • {app.applicantTribe} ({app.applicantState})
                          </div>
                        </td>

                        {/* Priority Tier */}
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-flex items-center gap-1 ${
                              item.tier === 'TIER_1_OFFER'
                                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                : 'bg-blue-100 text-blue-900 border-blue-300'
                            }`}
                          >
                            {item.tier === 'TIER_1_OFFER' ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Tier 1: Confirmed Offer</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 text-blue-600" />
                                <span>Tier 2: Exam Cleared Only</span>
                              </>
                            )}
                          </span>
                          <div className="text-[11px] text-slate-600 font-medium mt-0.5 line-clamp-1">
                            {app.formData.foreignUniversityName || app.formData.foreignCourseName || 'Awaiting Offer'}
                          </div>
                        </td>

                        {/* QS Rank / Exam */}
                        <td className="py-4 px-4 font-mono font-bold text-slate-900">
                          <div className="text-purple-700">{item.qsRankDisplay}</div>
                          <div className="text-[10px] text-slate-500 font-sans">
                            {app.formData.ieltsOrGreScore || app.formData.qualifyingExam}
                          </div>
                        </td>

                        {/* PG Marks */}
                        <td className="py-4 px-4 font-mono font-bold text-slate-900">
                          {app.formData.pgMarksPercentage}%
                        </td>

                        {/* Allocated Quota Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              item.isSelected
                                ? 'bg-purple-100 text-purple-900 border-purple-300'
                                : 'bg-amber-100 text-amber-900 border-amber-300'
                            }`}
                          >
                            {item.allocatedSlot}
                          </span>
                        </td>

                        {/* Committee Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              isAwarded
                                ? 'bg-emerald-100 text-emerald-900'
                                : isRejected
                                ? 'bg-rose-100 text-rose-900'
                                : isUnderScrutiny
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-blue-100 text-blue-900'
                            }`}
                          >
                            {isAwarded
                              ? 'SANCTIONED (PFMS)'
                              : isRejected
                              ? 'REJECTED'
                              : isUnderScrutiny
                              ? 'UNDER RE-SCRUTINY'
                              : 'SHORTLISTED'}
                          </span>
                          {app.committeeOverrideNote && (
                            <div className="text-[10px] text-amber-800 italic mt-0.5 line-clamp-1">
                              Note: {app.committeeOverrideNote}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right space-x-1 whitespace-nowrap">
                          {/* Remark */}
                          <button
                            onClick={() => {
                              setRemarkModalApp(app);
                              setRemarkText(app.committeeOverrideNote || '');
                            }}
                            className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                            title="Add Committee Remark"
                          >
                            <MessageSquare className="w-3.5 h-3.5 inline" />
                          </button>

                          {/* Flag for Scrutiny */}
                          <button
                            onClick={() => setScrutinyModalApp(app)}
                            className="p-1.5 rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-semibold"
                            title="Flag for Scrutiny Officer"
                          >
                            <Flag className="w-3.5 h-3.5 inline text-amber-600" />
                          </button>

                          {/* Approve / Sanction */}
                          {!isAwarded && (
                            <button
                              onClick={() => handleOpenEmailDrawer(app, 'SELECTED')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Reject */}
                          {!isRejected && (
                            <button
                              onClick={() => handleOpenEmailDrawer(app, 'NOT_SELECTED')}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-2 py-1.5 rounded-lg text-xs font-bold"
                              title="Reject Application"
                            >
                              <Ban className="w-3.5 h-3.5 inline" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: NFST DOMESTIC SHORTLIST */}
      {activeTab === 'NFST' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-emerald-50/40">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-900 text-xs font-bold px-2.5 py-0.5 rounded border border-emerald-300">
                  NFST RANKING MATRIX (750 SLOTS)
                </span>
                <span className="text-xs text-slate-600 font-mono">
                  Qualification: UGC-NET / CSIR-NET
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                National Fellowship for ST Students Merit Roster
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Priority Rules: Premier Institutes (IITs/AIIMS) Automatic Priority ➔ Category Cascade (Cat 1 PwD 5% ➔ Cat 2 PVTG 25 slots ➔ Cat 3 Female 30% ➔ Cat 4 General ST).
              </p>
            </div>

            <span className="text-xs font-mono font-bold bg-white text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-xs">
              Total Evaluated: {rankedNfst.length} Candidates
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Rank</th>
                  <th className="py-3.5 px-4">Scholar & Community</th>
                  <th className="py-3.5 px-4">Institute Priority</th>
                  <th className="py-3.5 px-4">Qualifying Exam Score</th>
                  <th className="py-3.5 px-4">PG Marks (%)</th>
                  <th className="py-3.5 px-4">Category Cascade Tier</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Committee Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <RefreshCw className="w-6 h-6 mx-auto mb-2 text-emerald-600 animate-spin" />
                      Loading NFST category cascade shortlists...
                    </td>
                  </tr>
                ) : rankedNfst.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500">
                      No NFST applications currently in queue.
                    </td>
                  </tr>
                ) : (
                  rankedNfst.map(item => {
                    const app = item.application;
                    const isAwarded = app.status === 'PROVISIONALLY_SELECTED';
                    const isRejected = app.status === 'REJECTED';
                    const isUnderScrutiny = app.status === 'UNDER_SCRUTINY';

                    return (
                      <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Rank */}
                        <td className="py-4 px-4">
                          <span
                            className={`w-7 h-7 rounded-full font-black flex items-center justify-center text-xs ${
                              item.isSelected
                                ? 'bg-emerald-800 text-white shadow-xs'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            #{item.rank}
                          </span>
                        </td>

                        {/* Scholar */}
                        <td className="py-4 px-4">
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{app.applicantName}</span>
                            {app.isPwd && (
                              <span className="bg-indigo-100 text-indigo-900 border border-indigo-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                PwD (45%)
                              </span>
                            )}
                            {app.isPvtg && (
                              <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                PVTG
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {app.id} • {app.applicantTribe} ({app.applicantState})
                          </div>
                        </td>

                        {/* Institute Priority */}
                        <td className="py-4 px-4">
                          {item.isPremierInstitute ? (
                            <span className="bg-blue-100 text-blue-900 border border-blue-300 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                              <Building2 className="w-3 h-3 text-blue-700" />
                              <span>Premier Institute Priority</span>
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded text-[10px] font-medium">
                              General University Pool
                            </span>
                          )}
                          <div className="text-[11px] text-slate-600 font-medium mt-0.5 line-clamp-1">
                            {app.formData.phdEnrolledUniversity || app.formData.pgInstitute}
                          </div>
                        </td>

                        {/* Qualifying Exam */}
                        <td className="py-4 px-4 font-mono font-bold text-slate-900">
                          <div className="text-emerald-700">{item.netScoreDisplay}</div>
                          <div className="text-[10px] text-slate-500 font-sans">
                            Roll: {app.formData.qualifyingExamRollNo || 'NTA-RECORD'}
                          </div>
                        </td>

                        {/* PG Marks */}
                        <td className="py-4 px-4 font-mono font-bold text-slate-900">
                          {app.formData.pgMarksPercentage}%
                        </td>

                        {/* Category Cascade */}
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              item.categoryTier === 'PWD'
                                ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                                : item.categoryTier === 'PVTG'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : item.categoryTier === 'FEMALE'
                                ? 'bg-purple-100 text-purple-900 border-purple-300'
                                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            }`}
                          >
                            {item.allocatedSlot}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              isAwarded
                                ? 'bg-emerald-100 text-emerald-900'
                                : isRejected
                                ? 'bg-rose-100 text-rose-900'
                                : isUnderScrutiny
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-blue-100 text-blue-900'
                            }`}
                          >
                            {isAwarded
                              ? 'SANCTIONED (PFMS)'
                              : isRejected
                              ? 'REJECTED'
                              : isUnderScrutiny
                              ? 'UNDER RE-SCRUTINY'
                              : 'SHORTLISTED'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right space-x-1 whitespace-nowrap">
                          {/* Remark */}
                          <button
                            onClick={() => {
                              setRemarkModalApp(app);
                              setRemarkText(app.committeeOverrideNote || '');
                            }}
                            className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                            title="Add Committee Remark"
                          >
                            <MessageSquare className="w-3.5 h-3.5 inline" />
                          </button>

                          {/* Flag for Scrutiny */}
                          <button
                            onClick={() => setScrutinyModalApp(app)}
                            className="p-1.5 rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-semibold"
                            title="Flag for Scrutiny Officer"
                          >
                            <Flag className="w-3.5 h-3.5 inline text-amber-600" />
                          </button>

                          {/* Approve / Sanction */}
                          {!isAwarded && (
                            <button
                              onClick={() => handleOpenEmailDrawer(app, 'SELECTED')}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}

                          {/* Reject */}
                          {!isRejected && (
                            <button
                              onClick={() => handleOpenEmailDrawer(app, 'NOT_SELECTED')}
                              className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-2 py-1.5 rounded-lg text-xs font-bold"
                              title="Reject Application"
                            >
                              <Ban className="w-3.5 h-3.5 inline" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD COMMITEE REMARK */}
      {remarkModalApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Add Committee Remark ({remarkModalApp.applicantName})
                </h3>
              </div>
              <button onClick={() => setRemarkModalApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Remarks are recorded in the sovereign audit trail and visible to Ministry officers.
              </p>
              <textarea
                rows={4}
                value={remarkText}
                onChange={e => setRemarkText(e.target.value)}
                placeholder="Enter committee remarks or affirmative action justification..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRemarkModalApp(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRemark}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors"
              >
                Save Remark
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FLAG FOR SCRUTINY */}
      {scrutinyModalApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Flag className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Flag for Scrutiny Review ({scrutinyModalApp.applicantName})
                </h3>
              </div>
              <button onClick={() => setScrutinyModalApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Routes application back to <strong>Dr. Rajeshwar Rao (Scrutiny Queue)</strong> for document re-inspection.
              </p>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Select Flag / Rejection Reason *</label>
                <select
                  value={flagReasonCategory}
                  onChange={e => handleReasonPresetChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold outline-none text-slate-900"
                >
                  {REASON_PRESETS.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-800 font-bold mb-1">Committee Remarks / Detailed Explanation *</label>
                <textarea
                  rows={3}
                  value={committeeRemarkText}
                  onChange={e => {
                    setCommitteeRemarkText(e.target.value);
                    setScrutinyReason(e.target.value);
                  }}
                  placeholder="Specify details for re-inspection..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none leading-relaxed text-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setScrutinyModalApp(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFlagScrutiny}
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Flag Application</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: SIMULATED AUTOMATED EMAIL NOTIFICATION DRAWER */}
      {emailDrawerOpen && targetEmailApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded font-mono border border-amber-800">
                      AUTOMATED EMAIL DISPATCH
                    </span>
                    <span className="text-xs text-slate-400">Selection Committee Portal</span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-0.5">
                    {emailType === 'SELECTED' ? 'Automated "Selected" Award Email' : 'Automated "Flagged / Not Selected" Status Email'}
                  </h3>
                </div>
              </div>
              <button onClick={() => setEmailDrawerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Reason Selection Controls when sending Flagged/Not Selected Email */}
            {emailType === 'NOT_SELECTED' && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs mb-6">
                <div>
                  <label className="block text-amber-400 font-bold mb-1">Select Flag / Rejection Reason Category *</label>
                  <select
                    value={flagReasonCategory}
                    onChange={e => handleReasonPresetChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs outline-none font-medium"
                  >
                    {REASON_PRESETS.map(p => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-amber-400 font-bold mb-1">Committee Remarks / Detailed Explanation *</label>
                  <textarea
                    rows={2}
                    value={committeeRemarkText}
                    onChange={e => setCommitteeRemarkText(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 text-xs outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* Email Metadata Controls */}
            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs font-mono mb-6">
              <div className="flex justify-between">
                <span className="text-slate-400">Sender (From):</span>
                <span className="text-emerald-400 font-bold">Ministry of Tribal Affairs &lt;fellowships-mota@gov.in&gt;</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recipient (To):</span>
                <span className="text-white font-bold">{targetEmailApp.formData.emailAddress || `${targetEmailApp.applicantName.toLowerCase().replace(/\s+/g, '.')}@scholar.in`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Subject:</span>
                <span className="text-amber-300 font-bold">
                  {emailType === 'SELECTED'
                    ? `🎉 Official Sanction Notice: ${targetEmailApp.schemeCode} Fellowship Award [${targetEmailApp.id}]`
                    : `[ACTION REQUIRED] Status Notice: ${targetEmailApp.schemeCode} Fellowship Evaluation [${targetEmailApp.id}]`}
                </span>
              </div>
            </div>

            {/* Rendered Email Template Content Box */}
            <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-inner text-xs space-y-4 max-h-80 overflow-y-auto leading-relaxed border border-slate-300">
              {/* Emblem Header in Email */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-serif font-black flex items-center justify-center text-[10px]">
                    सत्य
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-xs">Ministry of Tribal Affairs</div>
                    <div className="text-[10px] text-slate-500">Government of India • Shastri Bhawan, New Delhi</div>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-400">Ref: MoTA/{targetEmailApp.schemeCode}/2025</span>
              </div>

              {emailType === 'SELECTED' ? (
                <>
                  <p className="font-bold text-slate-900">
                    Dear {targetEmailApp.applicantName},
                  </p>
                  <p>
                    We are delighted to inform you that the <strong>Selection Committee</strong> of the Ministry of Tribal Affairs (MoTA) has officially approved your application <strong>{targetEmailApp.id}</strong> for the <strong>{targetEmailApp.schemeTitle}</strong>.
                  </p>
                  <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl space-y-1 font-mono text-[11px] text-emerald-950">
                    <div><strong>Scholar Name:</strong> {targetEmailApp.applicantName} ({targetEmailApp.applicantTribe} ST)</div>
                    <div><strong>Scheme Code:</strong> {targetEmailApp.schemeCode}</div>
                    <div><strong>Sanctioned Amount:</strong> {targetEmailApp.schemeCode === 'NOS' ? '100% Foreign Tuition + £9,900/year Living Grant' : '₹31,000 / month Stipend + ₹25,000 Contingency'}</div>
                    <div><strong>Disbursement Rail:</strong> Direct Benefit Transfer via Aadhaar-linked Bank ({targetEmailApp.formData.bankName})</div>
                  </div>
                  <p className="font-bold text-slate-800">Next Steps for Candidate:</p>
                  <ol className="list-decimal list-inside space-y-1 text-slate-700">
                    <li>Log into your VidyaSetu Student Portal to download your Official Sanction Order PDF.</li>
                    <li>Verify your PFMS Beneficiary Code for instant stipend transfer.</li>
                    <li>For NOS candidates: Present this sanction letter to Indian Embassy for expedited Visa processing.</li>
                  </ol>
                </>
              ) : (
                <>
                  <p className="font-bold text-slate-900">
                    Dear {targetEmailApp.applicantName},
                  </p>
                  <p>
                    Thank you for submitting your application <strong>{targetEmailApp.id}</strong> for the <strong>{targetEmailApp.schemeTitle}</strong>.
                  </p>
                  <div className="bg-rose-50 border border-rose-300 p-3 rounded-xl space-y-1.5 font-mono text-[11px] text-rose-950">
                    <div><strong>Evaluation Status:</strong> Flagged by Selection Committee — Action Required</div>
                    <div><strong>Flag Reason Category:</strong> {REASON_PRESETS.find(p => p.id === flagReasonCategory)?.label}</div>
                    <div><strong>Committee Remarks:</strong> {committeeRemarkText}</div>
                  </div>
                  <p className="text-slate-700">
                    Please log into your <strong>VidyaSetu Student Portal</strong> to upload corrected documents online or schedule an in-person visit at your regional ST Welfare Office.
                  </p>
                </>
              )}

              <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-600">
                <div>Yours sincerely,</div>
                <div className="font-bold text-slate-900">Prof. Kamala Tirkey</div>
                <div>Member Secretary, MoTA Selection Committee Board</div>
                <div>Government of India</div>
              </div>
            </div>

            {/* Email Dispatch Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-4 border-t border-slate-800">
              {emailSentSuccess ? (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-3 py-2 rounded-xl border border-emerald-800 inline-flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Automated Email & SMS notification simulated and logged successfully!</span>
                </span>
              ) : (
                <span className="text-xs text-slate-400">
                  Simulates instant email dispatch to scholar without requiring external SMTP credentials.
                </span>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEmailDrawerOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  Close
                </button>
                {!emailSentSuccess && (
                  <button
                    type="button"
                    disabled={emailSending}
                    onClick={handleSimulateSendEmail}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-2"
                  >
                    {emailSending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Dispatching...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Simulate Dispatch Email & Record Decision</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
