'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import {
  BarChart3,
  TrendingUp,
  Zap,
  ShieldCheck,
  Building,
  CreditCard,
  Users2,
  AlertTriangle,
  Download,
  Clock,
  Sparkles,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const { lang } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading || !data) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold">Aggregating nationwide tribal scholarship metrics...</p>
      </div>
    );
  }

  const { summary, stateWise, schemeWise, deficiencyBreakdown, tribeDistribution } = data;

  const maxStateCount = Math.max(...Object.values(stateWise) as number[]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
      {/* Top Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800">
                EXECUTIVE ANALYTICS • SIH 2026
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                Team: parllaxx_24951A05M7
              </span>
            </div>
            <h1 className="text-2xl font-black mt-2">
              MoTA Public Scheme Delivery & Impact Dashboard
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Real-time monitoring of 48-Hour SLAs, ₹1.80 Cr fiscal savings, and direct PFMS DBT transfers.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 inline-flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export MoTA Executive Briefing</span>
          </button>
        </div>

        {/* 4 Core Impact KPIs from PPT Slide 5 */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-800/80 p-4.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 block mb-1">Turnaround Acceleration</span>
            <div className="text-2xl font-black text-emerald-400">25x Faster</div>
            <div className="text-[11px] text-slate-400 mt-1">
              4.2 Days (vs 45-60 Day manual delays)
            </div>
          </div>

          <div className="bg-slate-800/80 p-4.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 block mb-1">Direct Annual Savings</span>
            <div className="text-2xl font-black text-amber-400">₹1.80 Crore / yr</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Manual third-party agencies eliminated
            </div>
          </div>

          <div className="bg-slate-800/80 p-4.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 block mb-1">PFMS DBT Sanctioned</span>
            <div className="text-2xl font-black text-blue-400">₹{summary.totalDisbursedCrores} Cr</div>
            <div className="text-[11px] text-slate-400 mt-1">
              100% Leakage Prevention via DBT
            </div>
          </div>

          <div className="bg-slate-800/80 p-4.5 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-400 block mb-1">AI Pre-Matching Rate</span>
            <div className="text-2xl font-black text-purple-400">{summary.aiAutoMatchRate}%</div>
            <div className="text-[11px] text-slate-400 mt-1">
              Jaro-Winkler &gt; 92% confidence
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Processing Time Comparison & Scheme Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Processing Time Comparison Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Processing Turnaround (Days to Sanction)
              </h3>
              <p className="text-xs text-slate-500">Legacy Manual Scrutiny vs VidyaSetu Sovereign AI Rail</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              -90.6% Latency Drop
            </span>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-700">Legacy Manual Scrutiny Baseline (45–60 Days)</span>
                <span className="text-rose-700 font-mono">45.0 Days</span>
              </div>
              <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden p-1">
                <div className="h-full bg-rose-500 rounded-full w-[90%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-slate-900">VidyaSetu 48-Hour AI Spotlight Pipeline</span>
                <span className="text-emerald-700 font-mono font-black">4.2 Days (25x Faster)</span>
              </div>
              <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden p-1">
                <div className="h-full bg-emerald-600 rounded-full w-[12%]" />
              </div>
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs mt-4">
            💡 <strong>Impact:</strong> Tribal scholars applying for foreign universities (NOS) no longer miss visa cut-off deadlines.
          </div>
        </div>

        {/* Scheme Cohort Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Scheme Intake & Budget Allocation
            </h3>
            <p className="text-xs text-slate-500">NFST (National Fellowship) vs NOS (National Overseas)</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">NFST (Domestic)</span>
              <div>
                <span className="text-slate-500 block">Total Received:</span>
                <span className="text-base font-black text-slate-900 font-mono">1,380</span>
              </div>
              <div>
                <span className="text-slate-500 block">Sanctioned Slots:</span>
                <span className="font-bold text-emerald-700">520 / 750 (69.3%)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Disbursed DBT:</span>
                <span className="font-bold text-blue-700 font-mono">₹42.60 Crores</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 block">NOS (Overseas)</span>
              <div>
                <span className="text-slate-500 block">Total Received:</span>
                <span className="text-base font-black text-slate-900 font-mono">160</span>
              </div>
              <div>
                <span className="text-slate-500 block">Sanctioned Slots:</span>
                <span className="font-bold text-purple-700">20 / 20 (100% Full)</span>
              </div>
              <div>
                <span className="text-slate-500 block">Disbursed Grant:</span>
                <span className="font-bold text-blue-700 font-mono">₹14.80 Crores</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* State-Wise Distribution Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              State-Wise Tribal Scholar Intake (Top Beneficiary States)
            </h3>
            <p className="text-xs text-slate-500">
              Extending regional reach to remote tribal hinterlands via mobile-first PWA.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
            All India Coverage
          </span>
        </div>

        <div className="space-y-3">
          {Object.entries(stateWise).map(([state, count]: [string, any]) => {
            const pct = Math.round((count / maxStateCount) * 100);

            return (
              <div key={state} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-800">{state}</span>
                  <span className="font-mono text-slate-600 font-semibold">{count} Scholars</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: Community/Tribe Representation & Deficiency Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tribe Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Tribe / Community Distribution Representation
            </h3>
            <p className="text-xs text-slate-500">
              Ensuring equitable access across diverse Scheduled Tribes.
            </p>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {tribeDistribution.map((tItem: any, idx: number) => (
              <div key={idx} className="py-2.5 flex justify-between items-center">
                <div>
                  <span className="font-bold text-slate-900">{tItem.tribe}</span>
                  <span className="text-[11px] text-slate-400 block">{tItem.state}</span>
                </div>
                <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md">
                  {tItem.count} scholars
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Deficiency Rate Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Top Scrutiny Deficiency Categories
            </h3>
            <p className="text-xs text-slate-500">
              Root cause analysis of clerical errors addressed by In-Browser Edge Blur Gate.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {deficiencyBreakdown.map((def: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-semibold">{def.type}</span>
                  <span className="font-mono font-bold text-amber-700">{def.percentage}% ({def.count})</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${def.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-xs mt-4">
            ✓ <strong>Mitigation:</strong> The in-browser Laplacian variance filter reduces blurry rejections to nearly zero before human scrutiny.
          </div>
        </div>
      </div>
    </div>
  );
}
