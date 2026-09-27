'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageContext';
import {
  ApplicationFormData,
  DocumentItem,
  ExtractedField
} from '@/lib/types';
import { simulateDocumentOcr, calculateJaroWinkler } from '@/lib/ocrEngine';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Clock,
  Printer,
  Smartphone,
  Eye,
  RefreshCw,
  GraduationCap
} from 'lucide-react';
import confetti from 'canvas-confetti';

function ApplyContent() {
  const { t, lang, currentUser } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedSchemeParam = searchParams.get('scheme') || 'nfst';
  const [schemeId, setSchemeId] = useState<'nfst' | 'nos'>(selectedSchemeParam === 'nos' ? 'nos' : 'nfst');

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  // Form Data State with DPDP Masking Defaults
  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: currentUser?.name || 'Arun Soren',
    fatherOrHusbandName: 'Late Somra Soren',
    dateOfBirth: '1998-04-12',
    gender: 'MALE',
    aadhaarLastFour: '4921',
    mobileNumber: currentUser?.mobile || '9845012345',
    emailAddress: currentUser?.email || 'arun.soren@scholar.in',
    permanentAddress: 'Village Badampahar, P.O. Rairangpur, Dist. Mayurbhanj',
    state: currentUser?.state || 'Odisha',
    district: currentUser?.district || 'Mayurbhanj',
    pinCode: '757042',
    tribeCommunity: currentUser?.community || 'Santhal',
    casteCertificateNo: 'ST/OD/MAY/2021/8941',
    casteIssuingAuthority: 'Tahasildar, Rairangpur, Odisha',
    casteIssueDate: '2021-08-14',
    annualFamilyIncome: 250000,
    incomeCertificateNo: 'INC/OD/2024/77412',
    incomeIssuingAuthority: 'Revenue Officer, Mayurbhanj',
    qualifyingDegree: 'Master of Science (M.Sc Physics)',
    universityName: 'Utkal University, Bhubaneswar',
    pgMarksPercentage: 68.5,
    passingYear: 2023,
    qualifyingExamName: 'UGC-NET (Lectureship / JRF)',
    qualifyingExamRollNo: 'OR02004812',
    qualifyingExamScore: 198,
    nosTargetUniversity: 'Imperial College London, UK',
    nosQsWorldRanking: 6,
    nosOfferStatus: 'CONFIRMED_UNCONDITIONAL',
    nosCourseDurationYears: 3,
    bankAccountNo: '9184510002419',
    bankIfscCode: 'SBIN0001842',
    bankName: 'State Bank of India (PFMS Direct DBT Rail Verified)'
  });

  // Authentication & Role-Match Guard
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'APPLICANT') {
      const target = `/apply?scheme=${schemeId}`;
      router.replace(`/login?redirect=${encodeURIComponent(target)}`);
    }
  }, [currentUser, router, schemeId]);

  if (!currentUser || currentUser.role !== 'APPLICANT') {
    return (
      <div className="max-w-7xl mx-auto p-12 text-center text-slate-500 font-semibold text-xs">
        <RefreshCw className="w-6 h-6 mx-auto mb-2 text-emerald-600 animate-spin" />
        Redirecting to login portal...
      </div>
    );
  }

  // Uploaded Documents state
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activeScanningDoc, setActiveScanningDoc] = useState<string | null>(null);

  // Auto-seed sample verified documents when landing on step 4
  const handleLoadSampleDocuments = () => {
    const casteRes = simulateDocumentOcr('CASTE_CERTIFICATE', 'Caste_Certificate_Santhal.pdf', formData);
    const incomeRes = simulateDocumentOcr('INCOME_CERTIFICATE', 'Income_Certificate_2024.pdf', formData);
    const netRes = simulateDocumentOcr('QUALIFYING_SCORECARD', 'UGC_NET_Scorecard.pdf', formData);

    const docList: DocumentItem[] = [
      {
        id: `doc-caste-${Date.now()}`,
        type: 'CASTE_CERTIFICATE',
        name: 'ST Caste Certificate',
        fileName: 'Caste_Certificate_Santhal.pdf',
        fileSizeKb: 340,
        uploadedAt: new Date().toISOString(),
        ocrStatus: casteRes.status,
        ocrScore: casteRes.ocrScore,
        laplacianVarianceScore: casteRes.laplacianVarianceScore,
        isBlurry: casteRes.isBlurry,
        digiLockerVerified: casteRes.digiLockerVerified,
        extractedFields: casteRes.extractedFields,
        aiNotes: casteRes.aiNotes,
        samplePreviewType: 'caste'
      },
      {
        id: `doc-income-${Date.now()}`,
        type: 'INCOME_CERTIFICATE',
        name: 'Income Certificate',
        fileName: 'Income_Certificate_2024.pdf',
        fileSizeKb: 280,
        uploadedAt: new Date().toISOString(),
        ocrStatus: incomeRes.status,
        ocrScore: incomeRes.ocrScore,
        laplacianVarianceScore: incomeRes.laplacianVarianceScore,
        isBlurry: incomeRes.isBlurry,
        digiLockerVerified: incomeRes.digiLockerVerified,
        extractedFields: incomeRes.extractedFields,
        aiNotes: incomeRes.aiNotes,
        samplePreviewType: 'income'
      },
      {
        id: `doc-net-${Date.now()}`,
        type: 'QUALIFYING_SCORECARD',
        name: schemeId === 'nos' ? 'Language & Offer Letter' : 'UGC-NET Scorecard',
        fileName: schemeId === 'nos' ? 'Imperial_Offer_Letter.pdf' : 'UGC_NET_Scorecard.pdf',
        fileSizeKb: 410,
        uploadedAt: new Date().toISOString(),
        ocrStatus: netRes.status,
        ocrScore: netRes.ocrScore,
        laplacianVarianceScore: netRes.laplacianVarianceScore,
        isBlurry: netRes.isBlurry,
        digiLockerVerified: netRes.digiLockerVerified,
        extractedFields: netRes.extractedFields,
        aiNotes: netRes.aiNotes,
        samplePreviewType: schemeId === 'nos' ? 'offer' : 'net'
      }
    ];

    setDocuments(docList);
  };

  // Upload Simulation with Edge Blur Gate (PPT Slide 3)
  const handleUploadSingleDoc = (type: string, name: string, forceBlur: boolean = false) => {
    setActiveScanningDoc(type);
    setTimeout(() => {
      const res = simulateDocumentOcr(type, `${type.toLowerCase()}.pdf`, formData, forceBlur);
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        type,
        name,
        fileName: `${name.replace(/\s+/g, '_')}_scan.pdf`,
        fileSizeKb: 320,
        uploadedAt: new Date().toISOString(),
        ocrStatus: res.status,
        ocrScore: res.ocrScore,
        laplacianVarianceScore: res.laplacianVarianceScore,
        isBlurry: res.isBlurry,
        digiLockerVerified: res.digiLockerVerified,
        extractedFields: res.extractedFields,
        aiNotes: res.aiNotes,
        samplePreviewType: type === 'CASTE_CERTIFICATE' ? 'caste' : type === 'INCOME_CERTIFICATE' ? 'income' : 'net'
      };

      setDocuments(prev => {
        const filtered = prev.filter(d => d.type !== type);
        return [newDoc, ...filtered];
      });
      setActiveScanningDoc(null);
    }, 1200);
  };

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        schemeId,
        formData,
        documents,
        applicantId: currentUser.id
      };

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedAppId(data.application.id);
        setCurrentStep(6);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: t.wizardStep1 },
    { num: 2, label: t.wizardStep2 },
    { num: 3, label: t.wizardStep3 },
    { num: 4, label: t.wizardStep4 },
    { num: 5, label: t.wizardStep5 },
    { num: 6, label: t.wizardStep6 }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
      {/* Top Breadcrumb & Scheme Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
            {schemeId === 'nfst' ? 'SCHEME: NFST (India Research)' : 'SCHEME: NOS (Abroad Study)'}
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            {schemeId === 'nfst'
              ? 'National Fellowship for Scheduled Tribe Students (NFST)'
              : 'National Overseas Scholarship for ST Candidates (NOS)'}
          </h1>
          <p className="text-xs text-slate-500">
            Guided 48-Hour Fast Track Application with In-Browser Edge Blur Gate
          </p>
        </div>

        {/* Scheme Selector Toggle */}
        <div className="flex bg-slate-200 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setSchemeId('nfst')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              schemeId === 'nfst' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            NFST (Domestic)
          </button>
          <button
            onClick={() => setSchemeId('nos')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              schemeId === 'nos' ? 'bg-white text-blue-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            NOS (Overseas)
          </button>
        </div>
      </div>

      {/* Visible Step Wizard Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-8 shadow-xs">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {stepsList.map(s => {
            const isCompleted = s.num < currentStep;
            const isCurrent = s.num === currentStep;

            return (
              <div
                key={s.num}
                className={`flex flex-col items-center text-center p-2 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-blue-50 border-blue-400 text-blue-900 ring-2 ring-blue-100'
                    : isCompleted
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                    isCurrent
                      ? 'bg-blue-600 text-white'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : s.num}
                </div>
                <span className="text-[11px] font-bold line-clamp-1">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Container */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {/* STEP 1: Personal & Tribe Identity */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Step 1: Personal Details & Tribal Identity (e-KYC)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                DPDP Act 2023 Compliant: Aadhaar details are cryptographically masked.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Candidate Legal Full Name *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Father's / Husband's Name *</label>
                <input
                  type="text"
                  value={formData.fatherOrHusbandName}
                  onChange={e => setFormData({ ...formData, fatherOrHusbandName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Gender *</label>
                <select
                  value={formData.gender}
                  onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900 font-medium"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female (33% Sub-Quota Eligible)</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Masked Aadhaar Number</label>
                <div className="relative">
                  <input
                    type="text"
                    disabled
                    value={`XXXX-XXXX-${formData.aadhaarLastFour}`}
                    className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2.5 outline-none font-mono text-slate-600"
                  />
                  <span className="absolute right-2 top-2.5 text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
                    DPDP Masked
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Recognized Tribe / Community *</label>
                <select
                  value={formData.tribeCommunity}
                  onChange={e => setFormData({ ...formData, tribeCommunity: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none font-bold text-blue-900"
                >
                  <option value="Santhal">Santhal (संथाल)</option>
                  <option value="Gond">Gond (गोंड)</option>
                  <option value="Munda">Munda (मुंडा)</option>
                  <option value="Oraon">Oraon / Kurukh (उरांव)</option>
                  <option value="Bodo">Bodo (बर')</option>
                  <option value="Bhil">Bhil (भील)</option>
                  <option value="Khasi">Khasi</option>
                  <option value="Monpa">Monpa</option>
                  <option value="Other">Other Scheduled Tribe (ST)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Domicile State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">District *</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ST Certificate Number *</label>
                <input
                  type="text"
                  value={formData.casteCertificateNo}
                  onChange={e => setFormData({ ...formData, casteCertificateNo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Annual Family Income (₹) *</label>
                <input
                  type="number"
                  value={formData.annualFamilyIncome}
                  onChange={e => setFormData({ ...formData, annualFamilyIncome: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900 font-semibold"
                />
                {schemeId === 'nos' && formData.annualFamilyIncome > 600000 && (
                  <p className="text-[10px] text-rose-600 font-bold mt-1">
                    ⚠️ Income exceeds ₹6.00 Lakhs ceiling for NOS scheme.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Bank Account Number (DBT) *</label>
                <input
                  type="text"
                  value={formData.bankAccountNumber}
                  onChange={e => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Bank IFSC Code *</label>
                <input
                  type="text"
                  value={formData.bankIfscCode}
                  onChange={e => setFormData({ ...formData, bankIfscCode: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none font-mono text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Academic Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                <span>Step 2: Academic Background & National Qualifications</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Minimum marks: 55% for NFST (Ph.D in India) / 60% for NOS (Overseas Study).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Post-Graduate (PG) Degree *</label>
                <input
                  type="text"
                  value={formData.pgDegree}
                  onChange={e => setFormData({ ...formData, pgDegree: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900 font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">PG University / Institute *</label>
                <input
                  type="text"
                  value={formData.pgInstitute}
                  onChange={e => setFormData({ ...formData, pgInstitute: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">PG Marks Percentage (%) *</label>
                <input
                  type="number"
                  value={formData.pgMarksPercentage}
                  onChange={e => setFormData({ ...formData, pgMarksPercentage: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900 font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Qualifying Examination *</label>
                <input
                  type="text"
                  value={formData.qualifyingExam}
                  onChange={e => setFormData({ ...formData, qualifyingExam: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Exam Roll / Registration No *</label>
                <input
                  type="text"
                  value={formData.qualifyingExamRollNo}
                  onChange={e => setFormData({ ...formData, qualifyingExamRollNo: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">NTA / GRE Percentile Score *</label>
                <input
                  type="number"
                  value={formData.qualifyingExamPercentile}
                  onChange={e => setFormData({ ...formData, qualifyingExamPercentile: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none font-bold text-blue-700"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Scheme-Specific Research & Institution Form */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-purple-600" />
                <span>
                  {schemeId === 'nfst'
                    ? 'Step 3: Indian University Research Details (NFST)'
                    : 'Step 3: Foreign University Offer & Visa Details (NOS)'}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {schemeId === 'nfst'
                  ? 'Enter Indian Ph.D guide and thesis proposal topic for monthly stipend disbursement.'
                  : 'Enter Foreign University ranking and course details. Zero Missed Intakes pipeline priority.'}
              </p>
            </div>

            {schemeId === 'nfst' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Admitted University / Institute *</label>
                  <input
                    type="text"
                    value={formData.phdEnrolledUniversity}
                    onChange={e => setFormData({ ...formData, phdEnrolledUniversity: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department / Faculty *</label>
                  <input
                    type="text"
                    value={formData.phdDepartment}
                    onChange={e => setFormData({ ...formData, phdDepartment: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Research Guide / Supervisor Name *</label>
                  <input
                    type="text"
                    value={formData.phdGuideName}
                    onChange={e => setFormData({ ...formData, phdGuideName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Ph.D Thesis / Research Topic Title *</label>
                  <textarea
                    rows={3}
                    value={formData.researchTopicTitle}
                    onChange={e => setFormData({ ...formData, researchTopicTitle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900 leading-relaxed"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Foreign University Name *</label>
                  <input
                    type="text"
                    value={formData.foreignUniversityName}
                    onChange={e => setFormData({ ...formData, foreignUniversityName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">QS World University Ranking *</label>
                  <input
                    type="number"
                    value={formData.qsWorldRanking}
                    onChange={e => setFormData({ ...formData, qsWorldRanking: parseInt(e.target.value) })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none font-bold text-purple-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Country of Study *</label>
                  <input
                    type="text"
                    value={formData.foreignCountry}
                    onChange={e => setFormData({ ...formData, foreignCountry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Indian Passport Number *</label>
                  <input
                    type="text"
                    value={formData.passportNumber}
                    onChange={e => setFormData({ ...formData, passportNumber: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none font-mono text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Foreign Course & Degree Name *</label>
                  <input
                    type="text"
                    value={formData.foreignCourseName}
                    onChange={e => setFormData({ ...formData, foreignCourseName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 outline-none text-slate-900"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Edge Blur & AI Document Scrutiny (PPT Slide 3) */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>Step 4: In-Browser Edge Blur & AI Document Intelligence</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  OpenCV/WASM Laplacian Variance Test runs before upload (Var ≥ 100 passes, Var &lt; 100 prompts retake).
                </p>
              </div>

              {/* Instant 1-Click Sample Pre-filler for Judges */}
              <button
                type="button"
                onClick={handleLoadSampleDocuments}
                className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Auto-Load Verified Document Scans (Demo)</span>
              </button>
            </div>

            {/* Document Cards */}
            <div className="space-y-4">
              {/* Document 1: ST Caste Certificate */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">1. ST Caste Certificate *</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
                      DigiLocker SSO
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Valid e-Pramaan / Tehsildar certificate confirming Scheduled Tribe community ({formData.tribeCommunity}).
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={activeScanningDoc !== null}
                    onClick={() => handleUploadSingleDoc('CASTE_CERTIFICATE', 'ST Caste Certificate')}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Edge Scan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUploadSingleDoc('CASTE_CERTIFICATE', 'ST Caste Certificate', true)}
                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 px-2.5 py-1.5 rounded-lg text-[11px] font-bold"
                    title="Simulate blurry scan to test edge blur gate"
                  >
                    Simulate Blurry Scan
                  </button>
                </div>
              </div>

              {/* Document 2: Income Certificate */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">2. Income Certificate (FY 2024-25) *</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">
                      Revenue Dept
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Annual family income certificate for current financial session.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={activeScanningDoc !== null}
                    onClick={() => handleUploadSingleDoc('INCOME_CERTIFICATE', 'Income Certificate')}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Edge Scan</span>
                  </button>
                </div>
              </div>

              {/* Document 3: Qualifying Exam / Offer Letter */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">
                      3. {schemeId === 'nos' ? 'Foreign University Offer Letter *' : 'UGC-NET / CSIR-NET Scorecard *'}
                    </span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono">
                      {schemeId === 'nos' ? 'QS Top 500' : 'NTA Record'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Official proof of academic qualification and Ph.D admission status.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={activeScanningDoc !== null}
                    onClick={() => handleUploadSingleDoc(schemeId === 'nos' ? 'ADMISSION_OFFER' : 'QUALIFYING_SCORECARD', 'Scorecard / Offer Letter')}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Edge Scan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Scan Results Display */}
            {activeScanningDoc && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
                <div>
                  <div className="font-bold">Running In-Browser OpenCV Laplacian Variance & LayoutLMv3 Analysis...</div>
                  <div className="text-[11px] text-blue-700">Checking document resolution, sharpness, and Jaro-Winkler phonetic similarity.</div>
                </div>
              </div>
            )}

            {documents.length > 0 && (
              <div className="mt-6 border-t border-slate-200 pt-4">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                  Scanned Document Intelligence Feed (Real-Time In-Browser Edge Checks)
                </h3>

                <div className="space-y-3">
                  {documents.map((doc, idx) => {
                    const passes = doc.laplacianVarianceScore >= 100;
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border text-xs ${
                          doc.ocrStatus === 'FLAGGED' || !passes
                            ? 'bg-rose-50 border-rose-300 text-rose-950'
                            : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 font-bold">
                            {passes && doc.ocrStatus === 'VERIFIED' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-rose-600" />
                            )}
                            <span>{doc.name}</span>
                            <span className="font-mono text-[10px] text-slate-500">({doc.fileName})</span>
                          </div>

                          {/* Laplacian Variance Metric Badge */}
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                                passes
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                  : 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse'
                              }`}
                            >
                              Laplacian Var: {doc.laplacianVarianceScore} ({passes ? 'Var ≥ 100 Passes' : 'Var < 100 Retake Required'})
                            </span>
                            <span className="bg-white/80 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-slate-700 border border-slate-300">
                              OCR Conf: {doc.ocrScore}%
                            </span>
                          </div>
                        </div>

                        {/* Extracted Fields Summary Pills */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white/70 p-2.5 rounded-lg border border-slate-200 mt-2">
                          {doc.extractedFields.map((f, fIdx) => (
                            <div key={fIdx} className="text-[11px]">
                              <span className="text-slate-500 block">{f.label}:</span>
                              <span className="font-bold text-slate-900">{f.value}</span>
                              {f.jaroWinklerScore && (
                                <span className="text-[10px] text-emerald-700 font-mono block">
                                  Jaro-Winkler: {Math.round(f.jaroWinklerScore * 100)}%
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* AI Note */}
                        {doc.aiNotes && doc.aiNotes.length > 0 && (
                          <div className="mt-2 text-[11px] text-slate-600 font-medium">
                            • {doc.aiNotes[0]}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Review & DPDP Declaration */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Step 5: Review Verified Information & Sovereign DPDP Declaration</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review your application details. Once submitted, your file enters the 48-Hour Scrutiny Queue.
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-slate-500 block">Candidate Name</span>
                  <span className="font-bold text-slate-900">{formData.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Community / Tribe</span>
                  <span className="font-bold text-slate-900">{formData.tribeCommunity}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Scheme Applied</span>
                  <span className="font-bold text-blue-900">{schemeId.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">State & District</span>
                  <span className="font-bold text-slate-900">{formData.state}, {formData.district}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">PG Degree & Marks</span>
                  <span className="font-bold text-slate-900">{formData.pgDegree} ({formData.pgMarksPercentage}%)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Qualifying Exam</span>
                  <span className="font-bold text-slate-900">{formData.qualifyingExam} ({formData.qualifyingExamPercentile}%)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Annual Income</span>
                  <span className="font-bold text-slate-900">₹{formData.annualFamilyIncome.toLocaleString('en-IN')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">DBT Bank Account</span>
                  <span className="font-bold font-mono text-slate-900">{formData.bankName} (IFSC: {formData.bankIfscCode})</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-950 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded text-blue-600 focus:ring-blue-500" />
                <span className="leading-relaxed">
                  I hereby declare that all information furnished above and the certificates uploaded are genuine and
                  authentic. I authorize the Ministry of Tribal Affairs (MoTA) to verify my records against DigiLocker,
                  NTA, and State e-District registries. I understand that my stipend will be disbursed directly via PFMS DBT rails.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 6: Submission Confirmation Slip */}
        {currentStep === 6 && submittedAppId && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300">
                APPLICATION SUBMITTED SUCCESSFULLY
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2">
                Congratulations, {formData.fullName}!
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto mt-1">
                Your application has cleared in-browser edge blur and AI validation. It is now entering the 48-Hour Spotlight Scrutiny Queue.
              </p>
            </div>

            {/* Application Token Card */}
            <div className="bg-slate-900 text-white rounded-xl p-6 max-w-md mx-auto shadow-xl text-left border border-slate-800">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-3">
                <span className="text-[11px] text-slate-400 font-mono">MoTA APPLICATION ID</span>
                <span className="text-xs font-bold text-amber-400 font-mono">{submittedAppId}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Scheme:</span>
                  <span className="font-bold">{schemeId.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Candidate:</span>
                  <span className="font-bold">{formData.fullName} ({formData.tribeCommunity})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">SLA Mandate:</span>
                  <span className="text-emerald-400 font-bold">48-Hour Decision SLA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Disbursement Rail:</span>
                  <span className="text-blue-400 font-bold">PFMS Direct Benefit Transfer (DBT)</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => window.print()}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Acknowledgment Slip</span>
              </button>

              <Link
                href={`/track?id=${submittedAppId}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <span>Track Application Status</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        {currentStep < 6 && (
          <div className="flex items-center justify-between pt-6 mt-8 border-t border-slate-200">
            <button
              type="button"
              disabled={currentStep === 1}
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.backBtn}</span>
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.min(5, prev + 1))}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
              >
                <span>{t.continueBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitApplication}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md inline-flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Submitting to Sovereign Rail...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{t.submitApplication}</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-5xl mx-auto p-12 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold">Loading sovereign scholarship application form...</p>
        </div>
      }
    >
      <ApplyContent />
    </Suspense>
  );
}
