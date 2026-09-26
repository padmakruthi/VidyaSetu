'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { Scheme } from '@/lib/types';
import {
  Sliders,
  ShieldCheck,
  CheckCircle2,
  Save,
  Globe2,
  GraduationCap,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function RulesConfigPage() {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('nfst');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const [rulesState, setRulesState] = useState({
    minPgMarksPercentage: 55,
    maxAge: 36,
    maxAnnualFamilyIncome: 800000,
    qualifyingExamRequired: true,
    requiredExamName: 'UGC-NET / CSIR-NET / GATE',
    femaleSubQuotaPercentage: 33,
    stipendAmountMonthly: 31000,
    annualContingency: 25000
  });

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/schemes');
      const data = await res.json();
      if (data.success && data.schemes.length > 0) {
        setSchemes(data.schemes);
        const active = data.schemes.find((s: Scheme) => s.id === selectedSchemeId) || data.schemes[0];
        setRulesState({
          minPgMarksPercentage: active.rules.minPgMarksPercentage,
          maxAge: active.rules.maxAge,
          maxAnnualFamilyIncome: active.rules.maxAnnualFamilyIncome || 800000,
          qualifyingExamRequired: active.rules.qualifyingExamRequired,
          requiredExamName: active.rules.requiredExamName,
          femaleSubQuotaPercentage: active.rules.femaleSubQuotaPercentage,
          stipendAmountMonthly: active.rules.stipendAmountMonthly,
          annualContingency: active.rules.annualContingency
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [selectedSchemeId]);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/schemes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeId: selectedSchemeId,
          rules: rulesState
        })
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800">
              ZERO-CODE MOTA RULEBOOK ENGINE
            </span>
            <h1 className="text-2xl font-black mt-2">
              Configurable Scheme Eligibility & Stipend Parameters
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Calibrate academic cut-offs, female sub-quotas, and PFMS disbursement rates dynamically without code deployment.
            </p>
          </div>

          {/* Scheme Switcher */}
          <div className="flex bg-slate-800 p-1 rounded-xl text-xs font-bold shrink-0 border border-slate-700">
            <button
              onClick={() => setSelectedSchemeId('nfst')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSchemeId === 'nfst' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              NFST (Domestic)
            </button>
            <button
              onClick={() => setSelectedSchemeId('nos')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedSchemeId === 'nos' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              NOS (Overseas)
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold">Loading scheme parameters...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-900">
              {selectedSchemeId === 'nfst'
                ? 'National Fellowship for ST (NFST) Policy Rules'
                : 'National Overseas Scholarship (NOS) Policy Rules'}
            </h2>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Status: Live & Enforced
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
            {/* Min Marks */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Minimum Post-Graduation Marks (%)
              </label>
              <input
                type="number"
                value={rulesState.minPgMarksPercentage}
                onChange={e => setRulesState({ ...rulesState, minPgMarksPercentage: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900 outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Current statutory floor: 55% ST</span>
            </div>

            {/* Max Age */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Maximum Age Limit (Years)
              </label>
              <input
                type="number"
                value={rulesState.maxAge}
                onChange={e => setRulesState({ ...rulesState, maxAge: parseInt(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900 outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Includes ST age relaxation (36 yrs)</span>
            </div>

            {/* Family Income Limit */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Family Income Ceiling (₹ / Year)
              </label>
              <input
                type="number"
                value={rulesState.maxAnnualFamilyIncome}
                onChange={e => setRulesState({ ...rulesState, maxAnnualFamilyIncome: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900 outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                {selectedSchemeId === 'nos' ? '₹8,00,000 statutory cap' : 'Optional priority filter for NFST'}
              </span>
            </div>

            {/* Female Sub-Quota */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Female Sub-Quota Allocation (%)
              </label>
              <input
                type="number"
                value={rulesState.femaleSubQuotaPercentage}
                onChange={e => setRulesState({ ...rulesState, femaleSubQuotaPercentage: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-purple-700 outline-none"
              />
              <span className="text-[10px] text-purple-700 font-semibold mt-1 block">Statutory floor: 33%</span>
            </div>

            {/* Monthly Stipend */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Monthly Stipend / Living Rate (₹)
              </label>
              <input
                type="number"
                value={rulesState.stipendAmountMonthly}
                onChange={e => setRulesState({ ...rulesState, stipendAmountMonthly: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-emerald-700 outline-none"
              />
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Disbursed via PFMS DBT rail</span>
            </div>

            {/* Annual Contingency */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Annual Research Contingency (₹)
              </label>
              <input
                type="number"
                value={rulesState.annualContingency}
                onChange={e => setRulesState({ ...rulesState, annualContingency: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900 outline-none"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Books, fieldwork & equipment grant</span>
            </div>
          </div>

          {/* Save Action Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-300 inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Rules updated and propagated across all portal forms!</span>
              </span>
            ) : (
              <span className="text-xs text-slate-500">
                Changes apply immediately to the Applicant Wizard and Merit Ranking matrix.
              </span>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Calibrating Rulebook...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Scheme Rules</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
