'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { StatusStepper } from '@/components/StatusStepper';
import { Application, DocumentItem } from '@/lib/types';
import { simulateDocumentOcr } from '@/lib/ocrEngine';
import {
  AlertTriangle,
  Upload,
  CheckCircle2,
  FileCheck,
  CreditCard,
  GraduationCap,
  Clock,
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function PortalPage() {
  const { currentUser, switchUser, lang } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [resubmitting, setResubmitting] = useState<boolean>(false);
  const [resubmitSuccess, setResubmitSuccess] = useState<boolean>(false);

  const fetchUserApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications?applicantId=${currentUser.id}`);
      const data = await res.json();
      if (data.success && data.applications.length > 0) {
        setApplications(data.applications);
        setSelectedApp(data.applications[0]);
      } else {
        // Fallback to all applications if no direct match
        const allRes = await fetch('/api/applications');
        const allData = await allRes.json();
        if (allData.success && allData.applications.length > 0) {
          setApplications(allData.applications);
          setSelectedApp(allData.applications[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserApplications();
  }, [currentUser]);

  // Handle 1-Click Deficiency Resolution (Re-uploading clean FY 2024-25 certificate)
  const handleResolveDeficiency = async () => {
    if (!selectedApp) return;
    setResubmitting(true);

    try {
      // Simulate clean OCR scan for new FY 2024-25 certificate
      const freshResult = simulateDocumentOcr(
        'INCOME_CERTIFICATE',
        'Income_Certificate_FY24-25_Renewed.pdf',
        { ...selectedApp.formData, annualFamilyIncome: 140000 },
        false // Not forced deficiency, fresh passes
      );

      const updatedDoc: DocumentItem = {
        id: `doc-renewed-${Date.now()}`,
        type: 'INCOME_CERTIFICATE',
        name: 'Income Certificate (FY 2024-25 Validated)',
        fileName: 'Income_Certificate_FY24-25_Renewed.pdf',
        fileSizeKb: 310,
        uploadedAt: new Date().toISOString(),
        ocrStatus: 'VERIFIED',
        ocrScore: 98,
        laplacianVarianceScore: 144.2, // Passes >= 100
        isBlurry: false,
        digiLockerVerified: true,
        extractedFields: freshResult.extractedFields,
        aiNotes: [
          'Edge Blur Gate: Laplacian Var 144.2 (Passes ≥ 100). Razor sharp scan.',
          'Financial Year verified: FY 2024-2025. Deficiency cleared.'
        ],
        samplePreviewType: 'income'
      };

      const res = await fetch(`/api/applications/${selectedApp.id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESOLVE_DEFICIENCY',
          officerName: selectedApp.applicantName,
          officerRole: 'APPLICANT',
          remarks: 'Uploaded refreshed Income Certificate for FY 2024-25.',
          data: {
            documentId: 'doc-vipin-income',
            updatedDoc
          }
        })
      });

      const resData = await res.json();
      if (resData.success) {
        setSelectedApp(resData.application);
        setResubmitSuccess(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.5 }
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResubmitting(false);
    }
  };

  const hasActiveDeficiency =
    selectedApp?.status === 'DEFICIENCY_FLAGGED' &&
    selectedApp.deficiencyNotices.some(n => !n.resolved);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
      {/* Student Welcome Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 ring-2 ring-blue-500/20 shrink-0">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-slate-700">
                {currentUser.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900">{currentUser.name}</h1>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                ST Scholar
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Community: <strong>{currentUser.community || 'Scheduled Tribe'}</strong> • State: {currentUser.state} • Mobile: {currentUser.mobile}
            </p>
          </div>
        </div>

        {/* Quick Student Switcher for SIH Evaluator */}
        <div className="bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-slate-500" />
          <span className="text-slate-500 font-medium">Switch Scholar:</span>
          <button
            onClick={() => switchUser({ id: 'user-vipin', name: 'Vipin Kumar Gond', email: 'vipin.gond@scholar.in', mobile: '9123456789', role: 'APPLICANT', state: 'Madhya Pradesh', community: 'Gond' })}
            className={`px-2 py-1 rounded font-bold ${currentUser.id === 'user-vipin' ? 'bg-amber-500 text-white' : 'text-slate-700 hover:bg-slate-200'}`}
          >
            Vipin (Deficiency Demo)
          </button>
          <button
            onClick={() => switchUser({ id: 'user-arun', name: 'Arun Soren', email: 'arun.soren@scholar.in', mobile: '9845012345', role: 'APPLICANT', state: 'Odisha', community: 'Santhal' })}
            className={`px-2 py-1 rounded font-bold ${currentUser.id === 'user-arun' ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-200'}`}
          >
            Arun (Verified NFST)
          </button>
          <button
            onClick={() => switchUser({ id: 'user-sunita', name: 'Sunita Munda', email: 'sunita.munda@scholar.in', mobile: '9876543210', role: 'APPLICANT', state: 'Jharkhand', community: 'Munda' })}
            className={`px-2 py-1 rounded font-bold ${currentUser.id === 'user-sunita' ? 'bg-purple-600 text-white' : 'text-slate-700 hover:bg-slate-200'}`}
          >
            Sunita (NOS Abroad)
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold">Loading scholar dashboard records...</p>
        </div>
      )}

      {selectedApp && !loading && (
        <div className="space-y-6">
          {/* Status Stepper & PPT 5-Stage Lifecycle Ribbon */}
          <StatusStepper
            status={selectedApp.status}
            lifecycleStage={selectedApp.currentLifecycleStage}
            submittedAt={selectedApp.submittedAt}
            updatedAt={selectedApp.updatedAt}
            hasDeficiency={hasActiveDeficiency}
            pfmsUtr={selectedApp.formData.pfmsUtrNumber}
          />

          {/* 1-Click Deficiency Resolution Box (Friendly, Non-Alarming UX) */}
          {hasActiveDeficiency && (
            <div className="bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-2xl p-6 shadow-md">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    <span>Action Required: Document Deficiency Clarification</span>
                  </div>
                  <h3 className="text-lg font-black text-amber-950">
                    {selectedApp.deficiencyNotices[0].title}
                  </h3>
                  <p className="text-xs text-amber-900 max-w-2xl leading-relaxed">
                    {selectedApp.deficiencyNotices[0].reason}
                  </p>
                  <p className="text-xs text-amber-800 font-semibold bg-white/60 p-2.5 rounded-lg border border-amber-200">
                    💡 <strong>What you need to do:</strong> {selectedApp.deficiencyNotices[0].suggestedAction}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col items-center">
                  <button
                    onClick={handleResolveDeficiency}
                    disabled={resubmitting}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-amber-900/20 transition-all flex items-center gap-2 hover:-translate-y-0.5"
                  >
                    {resubmitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Scanning & Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Re-Upload Valid Certificate (1-Click Fix)</span>
                      </>
                    )}
                  </button>
                  <span className="text-[10px] text-amber-700 font-mono mt-1">
                    Edge Blur Test (Var ≥ 100)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Success Alert after Resubmission */}
          {resubmitSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 text-emerald-950 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <strong className="text-sm block">Document Resubmitted Successfully!</strong>
                <span>
                  Your updated Income Certificate has passed the in-browser edge blur test (Laplacian Var 144.2).
                  Status updated to <strong>RESUBMITTED</strong>. Scrutiny officer has been notified.
                </span>
              </div>
            </div>
          )}

          {/* Quick Application Summary & DBT Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 md:col-span-2">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-xs text-slate-500 font-mono">ENROLLED SCHEME</span>
                  <h3 className="text-base font-bold text-slate-900">{selectedApp.schemeTitle}</h3>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  Status: {selectedApp.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Application ID</span>
                  <span className="font-bold font-mono text-slate-900">{selectedApp.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Jaro-Winkler Score</span>
                  <span className="font-bold font-mono text-emerald-700">{selectedApp.avgJaroWinklerScore}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Edge Blur Status</span>
                  <span className="font-bold text-emerald-700">{selectedApp.edgeIqaStatus}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">48-Hr SLA Mandate</span>
                  <span className="font-bold text-blue-700">Active</span>
                </div>
              </div>

              {/* Research Synopsis or Overseas Details */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
                <span className="text-slate-500 font-semibold block mb-1">
                  {selectedApp.schemeCode === 'NOS' ? 'Foreign University Admission' : 'Ph.D Research Topic'}
                </span>
                <p className="font-bold text-slate-900">
                  {selectedApp.schemeCode === 'NOS'
                    ? selectedApp.formData.foreignUniversityName
                    : selectedApp.formData.phdEnrolledUniversity}
                </p>
                <p className="text-slate-600 mt-0.5">
                  {selectedApp.schemeCode === 'NOS'
                    ? selectedApp.formData.foreignCourseName
                    : selectedApp.formData.researchTopicTitle}
                </p>
              </div>
            </div>

            {/* PFMS DBT Stipend Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Direct Bank Transfer (DBT)</span>
                </h4>
                <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  PFMS Connected
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block">Monthly Stipend Entitlement:</span>
                  <span className="font-black text-base text-slate-900">
                    {selectedApp.schemeCode === 'NOS' ? '£9,900 / year' : '₹31,000 / month'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Aadhaar Linked Bank:</span>
                  <span className="font-bold text-slate-900">{selectedApp.formData.bankName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Account Number (Masked):</span>
                  <span className="font-mono text-slate-700">XXXX-XXXX-{selectedApp.formData.bankAccountNumber.slice(-4)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">PFMS Transaction UTR:</span>
                  <span className="font-mono font-bold text-blue-700">
                    {selectedApp.formData.pfmsUtrNumber || 'Awaiting Final Sanction Release'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-blue-600" />
              <span>Uploaded Documents & In-Browser Edge Blur Scores</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {selectedApp.documents.map((doc, dIdx) => (
                <div key={dIdx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-900">{doc.name}</span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          doc.laplacianVarianceScore >= 100
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-rose-100 text-rose-900'
                        }`}
                      >
                        Var: {doc.laplacianVarianceScore}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono truncate">{doc.fileName}</p>
                    <p className="text-[11px] text-slate-600 mt-2 font-medium">
                      Status: <strong className={doc.ocrStatus === 'VERIFIED' ? 'text-emerald-700' : 'text-amber-700'}>{doc.ocrStatus}</strong>
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
                    <span>OCR Conf: {doc.ocrScore}%</span>
                    {doc.digiLockerVerified && (
                      <span className="text-blue-700 font-semibold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        DigiLocker
                      </span>
                    )}
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
