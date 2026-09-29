'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import { DocumentViewer } from '@/components/DocumentViewer';
import { Application, DocumentItem } from '@/lib/types';
import {
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowLeft,
  X,
  Send,
  CreditCard,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function SpotlightReviewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { currentUser } = useLanguage();

  const [application, setApplication] = useState<Application | null>(null);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0);
  const [highlightedField, setHighlightedField] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionInProgress, setActionInProgress] = useState<boolean>(false);

  // Deficiency Modal State
  const [deficiencyModalOpen, setDeficiencyModalOpen] = useState<boolean>(false);
  const [deficiencyData, setDeficiencyData] = useState({
    title: 'Income Certificate Outdated / Edge Blur',
    reason: 'The income certificate uploaded is dated 2021. Ministry guidelines mandate a fresh certificate for FY 2024-25.',
    suggestedAction: 'Please obtain and upload a current Income Certificate for FY 2024-25 with Laplacian Var ≥ 100.',
    officerRemarks: 'All other documents including Caste Certificate are verified authentic.'
  });

  const fetchApplication = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications/${id}`);
      const data = await res.json();
      if (data.success && data.application) {
        setApplication(data.application);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchApplication();
  }, [id]);

  const handleAction = async (action: string, extraData: any = {}) => {
    setActionInProgress(true);
    try {
      const res = await fetch(`/api/applications/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          officerName: currentUser.name,
          officerRole: currentUser.role,
          remarks: extraData.remarks || 'Verified via Dual-Pane Spotlight UI in under 30 seconds.',
          data: extraData
        })
      });

      const data = await res.json();
      if (data.success) {
        setApplication(data.application);
        setDeficiencyModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionInProgress(false);
    }
  };

  if (loading || !application) {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center text-slate-500">
        <RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-spin" />
        <p className="text-sm font-semibold">Opening Dual-Pane Spotlight UI for {id}...</p>
      </div>
    );
  }

  const activeDoc = application.documents[selectedDocIndex] || application.documents[0];
  const hasBlurryDoc = application.documents.some(d => d.isBlurry || d.laplacianVarianceScore < 100 || d.ocrStatus === 'FLAGGED') || application.edgeIqaStatus === 'FAILED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
      {/* Blurry Document AI Warning Banner */}
      {hasBlurryDoc && (
        <div className="bg-rose-50 border-2 border-rose-400 p-4 rounded-2xl flex items-center justify-between text-rose-950 text-xs shadow-md">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0" />
            <div>
              <span className="font-black text-sm text-rose-900 block">
                ⚠️ CRITICAL AI SECURITY ALERT: BLURRY SCAN DETECTED
              </span>
              <p className="text-xs text-rose-800 font-medium mt-0.5">
                One or more document scans failed Laplacian Variance Edge Blur testing (Score &lt; 100). Approval is blocked until a clear certificate is re-uploaded.
              </p>
            </div>
          </div>
          <button
            onClick={() => setDeficiencyModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-xs shrink-0 shadow-sm"
          >
            Request Re-upload &rarr;
          </button>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            href="/admin"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                {application.id}
              </span>
              <span className="text-xs font-bold text-slate-700">
                {application.applicantName} ({application.applicantTribe} • {application.applicantState})
              </span>
              <span className="text-[10px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                {application.schemeCode}
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono">
                {application.schemeCode === 'NOS' ? '16 / 20 Slots Available' : '712 / 750 Slots Available'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-3">
              <span>Jaro-Winkler: <strong className="text-emerald-700 font-mono">{application.avgJaroWinklerScore}%</strong></span>
              <span>•</span>
              <span>Edge Blur Gate: <strong className={hasBlurryDoc ? 'text-rose-600 font-bold' : 'text-emerald-700'}>{application.edgeIqaStatus}</strong></span>
              <span>•</span>
              <span>AI Risk: <strong className="text-slate-900">{application.aiRiskScore}/100</strong></span>
            </div>
          </div>
        </div>

        {/* Action Buttons for Scrutiny Officer (30-Sec Review) */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setDeficiencyModalOpen(true)}
            disabled={actionInProgress}
            className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            <span>Raise Deficiency</span>
          </button>

          <button
            onClick={() => handleAction('VERIFY_APPLICATION')}
            disabled={actionInProgress || hasBlurryDoc}
            className={`${
              hasBlurryDoc
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            } px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5`}
            title={hasBlurryDoc ? 'Approval blocked due to blurry document scan' : '1-Click AI Slot Allocation & Award'}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{hasBlurryDoc ? 'Approval Blocked (Blurry)' : '1-Click AI Approve Slot (30s)'}</span>
          </button>

          <button
            onClick={() => handleAction('COMMITTEE_SHORTLIST')}
            disabled={actionInProgress}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm inline-flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Forward to Committee</span>
          </button>
        </div>
      </div>

      {/* Dual-Pane Spotlight UI Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Pane: Interactive Document Viewer (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Document Tabs */}
          {application.documents.length > 0 && (
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {application.documents.map((doc, idx) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocIndex(idx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                    selectedDocIndex === idx
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {doc.name}
                  <span
                    className={`ml-1.5 text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      doc.ocrStatus === 'VERIFIED' ? 'bg-emerald-800 text-white' : 'bg-rose-800 text-white'
                    }`}
                  >
                    Var {doc.laplacianVarianceScore}
                  </span>
                </button>
              ))}
            </div>
          )}

          {activeDoc ? (
            <DocumentViewer
              document={activeDoc}
              highlightedField={highlightedField}
              onSelectField={f => setHighlightedField(f)}
            />
          ) : (
            <div className="bg-slate-900 text-slate-400 h-[500px] rounded-xl flex items-center justify-center text-xs">
              No scanned documents attached to this application record.
            </div>
          )}
        </div>

        {/* Right Pane: Extracted Field vs Form Value Comparison (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="border-b border-slate-100 pb-3 mb-4">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider font-mono">
                SPOTLIGHT COMPARISON • LAYOUTLMV3
              </span>
              <h3 className="text-base font-black text-slate-900 mt-0.5">
                Form Submission vs Sovereign Ingest
              </h3>
              <p className="text-[11px] text-slate-500">
                Click any row to pinpoint bounding box on left document pane.
              </p>
            </div>

            {/* Extracted Fields Comparison Table */}
            {activeDoc && activeDoc.extractedFields ? (
              <div className="space-y-2.5">
                {activeDoc.extractedFields.map((field, fIdx) => {
                  const isMatch = field.matchesForm;
                  const isFocused = highlightedField === field.fieldName;

                  return (
                    <div
                      key={fIdx}
                      onClick={() => setHighlightedField(field.fieldName)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isFocused
                          ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-100'
                          : isMatch
                          ? 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                          : 'bg-rose-50 border-rose-300'
                      }`}
                    >
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="font-bold text-xs text-slate-800">{field.label}</span>
                        <div className="flex items-center gap-1.5 font-mono text-[10px]">
                          {field.jaroWinklerScore && (
                            <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                              Jaro: {Math.round(field.jaroWinklerScore * 100)}%
                            </span>
                          )}
                          <span
                            className={`px-1.5 py-0.2 rounded font-bold ${
                              isMatch ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isMatch ? 'Match ✓' : 'Mismatch ⚠️'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/60 mt-1">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Form Input:</span>
                          <span className="font-medium text-slate-800 font-mono">
                            {field.formValue || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">OCR Extracted:</span>
                          <span className="font-bold text-slate-900 font-mono">{field.value}</span>
                        </div>
                      </div>

                      {field.remarks && (
                        <div className="mt-1.5 text-[10px] text-rose-700 font-semibold">
                          ⚠️ {field.remarks}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* Bhashini Dialect Resolution Badge */}
            <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <span className="text-[10px] font-bold text-purple-700 font-mono block">
                BHASHINI AI PHONETIC DIALECT RESOLUTION:
              </span>
              <p className="text-[11px] text-slate-700 font-medium">
                {application.bhashiniDialectResolution}
              </p>
            </div>
          </div>

          {/* AI Highlights & Mitigations */}
          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-950 space-y-1.5">
            <span className="font-bold flex items-center gap-1.5 text-emerald-800">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Recommendation Engine: {application.aiRecommendation.replace(/_/g, ' ')}</span>
            </span>
            <ul className="space-y-1 text-[11px] text-emerald-900 list-disc list-inside">
              {application.aiHighlights.map((h, hIdx) => (
                <li key={hIdx}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Deficiency Modal */}
      {deficiencyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-900">Raise Deficiency Notice</h3>
              </div>
              <button
                onClick={() => setDeficiencyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Pre-filled Reason Templates</label>
                <select
                  onChange={e => {
                    const val = e.target.value;
                    if (val === 'income_expired') {
                      setDeficiencyData({
                        title: 'Income Certificate Outdated (FY 2021-22)',
                        reason: 'The income certificate uploaded is dated 2021. Ministry guidelines mandate a fresh certificate for FY 2024-25.',
                        suggestedAction: 'Please obtain and upload a current Income Certificate for FY 2024-25.',
                        officerRemarks: 'All other documents verified authentic.'
                      });
                    } else if (val === 'edge_blur') {
                      setDeficiencyData({
                        title: 'Blurry Scan / Low Resolution (Var < 100)',
                        reason: 'The uploaded scan has high camera blur and failed the Laplacian variance sharpness test.',
                        suggestedAction: 'Please place your certificate on a flat, well-lit surface and re-scan.',
                        officerRemarks: 'Document text is illegible.'
                      });
                    } else if (val === 'name_mismatch') {
                      setDeficiencyData({
                        title: 'Name Spelling Mismatch on Certificate',
                        reason: 'Certificate displays initials instead of full legal name matching Aadhaar.',
                        suggestedAction: 'Please upload an affidavit or corrected e-Pramaan certificate.',
                        officerRemarks: 'Initials mismatch.'
                      });
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none"
                >
                  <option value="income_expired">Outdated Income Certificate (FY 2021-22)</option>
                  <option value="edge_blur">Blurry Scan / Edge Filter Failed (Var &lt; 100)</option>
                  <option value="name_mismatch">Name Spelling / Initials Mismatch</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Deficiency Notice Title</label>
                <input
                  type="text"
                  value={deficiencyData.title}
                  onChange={e => setDeficiencyData({ ...deficiencyData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Detailed Explanation</label>
                <textarea
                  rows={3}
                  value={deficiencyData.reason}
                  onChange={e => setDeficiencyData({ ...deficiencyData, reason: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Action Required from Scholar</label>
                <input
                  type="text"
                  value={deficiencyData.suggestedAction}
                  onChange={e => setDeficiencyData({ ...deficiencyData, suggestedAction: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeficiencyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleAction('RAISE_DEFICIENCY', deficiencyData)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Dispatch Deficiency Alert (SMS & App)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
