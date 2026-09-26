'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import { Application } from '@/lib/types';
import {
  FileCheck2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Zap,
  CheckCircle,
  Eye,
  RefreshCw
} from 'lucide-react';

export default function AdminQueuePage() {
  const { currentUser, lang } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterScheme, setFilterScheme] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const filteredApps = applications.filter(app => {
    if (filterScheme !== 'ALL' && app.schemeCode !== filterScheme) return false;
    if (filterStatus !== 'ALL' && app.status !== filterStatus) return false;
    if (filterRisk === 'LOW' && app.aiRiskScore > 20) return false;
    if (filterRisk === 'MEDIUM' && (app.aiRiskScore <= 20 || app.aiRiskScore > 40)) return false;
    if (filterRisk === 'HIGH' && app.aiRiskScore <= 40) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        app.id.toLowerCase().includes(q) ||
        app.applicantName.toLowerCase().includes(q) ||
        app.applicantTribe.toLowerCase().includes(q) ||
        app.applicantState.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const verifiedCount = applications.filter(a =>
    ['SCRUTINY_VERIFIED', 'COMMITTEE_SHORTLISTED', 'PROVISIONALLY_SELECTED'].includes(a.status)
  ).length;

  const deficiencyCount = applications.filter(a => a.status === 'DEFICIENCY_FLAGGED').length;
  const underScrutinyCount = applications.filter(a => a.status === 'UNDER_SCRUTINY' || a.status === 'SUBMITTED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
      {/* Top Banner & KPI Cards */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800">
                MoTA SCRUTINY CELL • NODAL DESK
              </span>
              <span className="text-xs bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-mono">
                Officer: {currentUser.name}
              </span>
            </div>
            <h1 className="text-2xl font-black mt-2">
              Spotlight AI Scrutiny & Ingestion Queue
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Dual-Pane LayoutLMv3 Pre-Matching • 30-Second Verification • Strict Human-in-the-Loop Safeguard
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-mono">Mandated Turnaround</span>
            <span className="text-xl font-black text-emerald-400">48-Hour Decision SLA</span>
          </div>
        </div>

        {/* 4 Spotlight Summary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Under Scrutiny Queue</span>
              <Clock className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white">{underScrutinyCount}</div>
            <div className="text-[11px] text-blue-400 mt-0.5">Average review: ~28 secs</div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Verified & Fast-Tracked</span>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">{verifiedCount}</div>
            <div className="text-[11px] text-emerald-300 mt-0.5">Green channel pass-through</div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Active Deficiencies</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">{deficiencyCount}</div>
            <div className="text-[11px] text-amber-300 mt-0.5">Auto-notified via SMS</div>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Annual Fiscal Savings</span>
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-purple-300">₹1.80 Cr / yr</div>
            <div className="text-[11px] text-purple-200 mt-0.5">3rd-party scrutiny eliminated</div>
          </div>
        </div>
      </div>

      {/* Strict Human-in-the-Loop Policy Safeguard Strip (PPT Slide 4) */}
      <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-center justify-between text-amber-950 text-xs shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            <strong>Strict Policy: Zero Autonomous Rejections.</strong> AI assists with spotlight bounding boxes and
            Jaro-Winkler phonetic similarity; final approval strictly stays with the nodal officer.
          </span>
        </div>
        <span className="font-mono text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded font-bold shrink-0">
          MoTA Rulebook Active
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by ID, Name, Tribe, or State..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>

          <select
            value={filterScheme}
            onChange={e => setFilterScheme(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none font-medium"
          >
            <option value="ALL">All Schemes</option>
            <option value="NFST">NFST (Domestic)</option>
            <option value="NOS">NOS (Overseas)</option>
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="UNDER_SCRUTINY">Under Scrutiny</option>
            <option value="DEFICIENCY_FLAGGED">Deficiency Flagged</option>
            <option value="RESUBMITTED">Resubmitted</option>
            <option value="SCRUTINY_VERIFIED">Scrutiny Verified</option>
            <option value="COMMITTEE_SHORTLISTED">Committee Shortlisted</option>
            <option value="PROVISIONALLY_SELECTED">Selected</option>
          </select>

          <select
            value={filterRisk}
            onChange={e => setFilterRisk(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 outline-none font-medium"
          >
            <option value="ALL">All AI Risk Levels</option>
            <option value="LOW">Low Risk (&le; 20)</option>
            <option value="MEDIUM">Medium Risk (21 - 40)</option>
            <option value="HIGH">High Risk (&gt; 40)</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">Application ID</th>
                <th className="py-3 px-4">Scholar & Tribe</th>
                <th className="py-3 px-4">Scheme</th>
                <th className="py-3 px-4">Edge Blur (IQA)</th>
                <th className="py-3 px-4">Jaro-Winkler</th>
                <th className="py-3 px-4">AI Risk & Recommendation</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Spotlight Review</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 mx-auto mb-2 text-blue-600 animate-spin" />
                    Loading applications queue...
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No applications found matching the current filters.
                  </td>
                </tr>
              ) : (
                filteredApps.map(app => {
                  const isLowRisk = app.aiRiskScore <= 20;
                  const isHighRisk = app.aiRiskScore > 40;

                  return (
                    <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                      {/* ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {app.id}
                      </td>

                      {/* Scholar & Tribe */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{app.applicantName}</div>
                        <div className="text-[11px] text-slate-500">
                          {app.applicantTribe} ({app.applicantState})
                        </div>
                      </td>

                      {/* Scheme */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            app.schemeCode === 'NOS'
                              ? 'bg-purple-100 text-purple-900'
                              : 'bg-blue-100 text-blue-900'
                          }`}
                        >
                          {app.schemeCode}
                        </span>
                      </td>

                      {/* Edge Blur / Laplacian Variance */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            app.edgeIqaStatus === 'PASSED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {app.edgeIqaStatus === 'PASSED' ? 'Var ≥ 100 Pass' : 'Var < 100 Alert'}
                        </span>
                      </td>

                      {/* Jaro-Winkler Similarity */}
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                        {app.avgJaroWinklerScore}%
                      </td>

                      {/* AI Risk Score & Recommendation */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isLowRisk ? 'bg-emerald-500' : isHighRisk ? 'bg-rose-500' : 'bg-amber-500'
                            }`}
                          />
                          <span className="font-bold font-mono text-slate-900">
                            Risk {app.aiRiskScore}/100
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {app.aiRecommendation.replace(/_/g, ' ')}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-block ${
                            app.status === 'SCRUTINY_VERIFIED' || app.status === 'PROVISIONALLY_SELECTED'
                              ? 'bg-emerald-100 text-emerald-900'
                              : app.status === 'DEFICIENCY_FLAGGED'
                              ? 'bg-amber-100 text-amber-900'
                              : app.status === 'RESUBMITTED'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {app.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Spotlight Action */}
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/review/${app.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Spotlight Review (30s)</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
