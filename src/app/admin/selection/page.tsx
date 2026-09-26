'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { Application } from '@/lib/types';
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
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SelectionCommitteePage() {
  const { currentUser } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedScheme, setSelectedScheme] = useState<string>('NFST');
  const [overrideModalApp, setOverrideModalApp] = useState<Application | null>(null);
  const [overrideScore, setOverrideScore] = useState<number>(90);
  const [overrideReason, setOverrideReason] = useState<string>('Special affirmative consideration: Scholar from Particularly Vulnerable Tribal Group (PVTG).');
  const [disbursementSuccessId, setDisbursementSuccessId] = useState<string | null>(null);

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
    fetchApplications();
  }, []);

  const eligibleApps = applications
    .filter(a => a.schemeCode === selectedScheme)
    .sort((a, b) => b.meritScore - a.meritScore);

  const handleSaveOverride = async () => {
    if (!overrideModalApp) return;

    try {
      const res = await fetch(`/api/applications/${overrideModalApp.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'OVERRIDE_MERIT_SCORE',
          officerName: currentUser.name,
          officerRole: 'SELECTION_COMMITTEE',
          data: {
            newScore: overrideScore,
            overrideReason
          }
        })
      });

      const data = await res.json();
      if (data.success) {
        setOverrideModalApp(null);
        fetchApplications();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAwardSanction = async (appId: string) => {
    try {
      const res = await fetch(`/api/applications/${appId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'AWARD_FELLOWSHIP',
          officerName: currentUser.name,
          officerRole: 'SELECTION_COMMITTEE',
          remarks: 'Selection Committee approved award. Sanction order generated.'
        })
      });

      const data = await res.json();
      if (data.success) {
        setDisbursementSuccessId(appId);
        fetchApplications();
        confetti({
          particleCount: 70,
          spread: 50,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      console.error(e);
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
                Panelist: {currentUser.name}
              </span>
            </div>
            <h1 className="text-2xl font-black mt-2">
              Merit-Based Selection Assist & Quota Allocation
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Automated ranking matrix calibrated against NTA percentiles, academic rigor, and research impact. Human override strictly audited.
            </p>
          </div>

          {/* Scheme Switcher */}
          <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-bold shrink-0 border border-slate-700">
            <button
              onClick={() => setSelectedScheme('NFST')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedScheme === 'NFST' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              NFST Cohort (750 Slots)
            </button>
            <button
              onClick={() => setSelectedScheme('NOS')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedScheme === 'NOS' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              NOS Overseas (20 Slots)
            </button>
          </div>
        </div>
      </div>

      {/* Quota Tracking Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            ST Representation
          </span>
          <div className="text-2xl font-black text-slate-900">100% Guaranteed</div>
          <p className="text-xs text-slate-500 mt-0.5">Sovereign affirmative mandate per Presidential Order</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Female Sub-Quota Tracking
          </span>
          <div className="text-2xl font-black text-emerald-600">38.4% Allocated</div>
          <p className="text-xs text-emerald-700 mt-0.5">Exceeds statutory 33% female sub-quota floor</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
            PFMS DBT Sanction Ready
          </span>
          <div className="text-2xl font-black text-blue-600">₹31,000 / month</div>
          <p className="text-xs text-blue-700 mt-0.5">1-click direct disbursement to bank</p>
        </div>
      </div>

      {/* Merit Shortlist Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Ranked Provisional Merit Roster ({selectedScheme})
            </h3>
            <p className="text-xs text-slate-500">
              Roster auto-generated via ranking formula: Exam Percentile (45%) + PG Marks (45%) + Academic Rating (10%).
            </p>
          </div>
          <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-md">
            Human Override Audited
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">Merit Rank</th>
                <th className="py-3 px-4">Scholar Details</th>
                <th className="py-3 px-4">Community / Tribe</th>
                <th className="py-3 px-4">Qualifying Exam & Percentile</th>
                <th className="py-3 px-4">PG Marks (%)</th>
                <th className="py-3 px-4">Composite Merit Score</th>
                <th className="py-3 px-4">Committee Status</th>
                <th className="py-3 px-4 text-right">Committee Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 mx-auto mb-2 text-blue-600 animate-spin" />
                    Loading merit shortlists...
                  </td>
                </tr>
              ) : eligibleApps.map((app, rIdx) => {
                const rank = rIdx + 1;
                const isAwarded = app.status === 'PROVISIONALLY_SELECTED';

                return (
                  <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-black flex items-center justify-center text-xs">
                        #{rank}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{app.applicantName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{app.id}</div>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {app.applicantTribe} ({app.applicantState})
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{app.formData.qualifyingExam}</div>
                      <div className="text-[11px] text-blue-700 font-mono">
                        {app.formData.qualifyingExamPercentile}%
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 font-mono">
                      {app.formData.pgMarksPercentage}%
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-sm font-black text-purple-700 font-mono">
                        {app.meritScore} / 100
                      </div>
                      {app.committeeOverrideNote && (
                        <div className="text-[10px] text-amber-700 italic">
                          Override: {app.committeeOverrideNote}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isAwarded
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-purple-100 text-purple-900'
                        }`}
                      >
                        {isAwarded ? 'SANCTIONED (PFMS)' : 'SHORTLISTED'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => {
                          setOverrideModalApp(app);
                          setOverrideScore(app.meritScore);
                        }}
                        className="p-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                        title="Override score with mandatory justification"
                      >
                        <Edit3 className="w-3.5 h-3.5 inline mr-1" />
                        Override
                      </button>

                      {!isAwarded ? (
                        <button
                          onClick={() => handleAwardSanction(app.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs inline-flex items-center gap-1"
                        >
                          <CreditCard className="w-3 h-3" />
                          <span>Sanction Fellowship</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-700 font-bold font-mono">
                          ✓ Sanctioned
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Human Override Modal */}
      {overrideModalApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Committee Merit Score Override ({overrideModalApp.applicantName})
                </h3>
              </div>
              <button onClick={() => setOverrideModalApp(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-500">Current AI Composite Score:</span>
                  <span className="font-bold text-slate-900 font-mono">{overrideModalApp.meritScore}/100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scholar & Community:</span>
                  <span className="font-bold">{overrideModalApp.applicantName} ({overrideModalApp.applicantTribe})</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Adjusted Score (0 to 100) *
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={overrideScore}
                  onChange={e => setOverrideScore(parseFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-purple-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Mandatory Committee Justification Note *
                </label>
                <textarea
                  rows={3}
                  value={overrideReason}
                  onChange={e => setOverrideReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none leading-relaxed"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Audited under MoTA Sovereign Decision Registry.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setOverrideModalApp(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveOverride}
                className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Save Audited Override</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
