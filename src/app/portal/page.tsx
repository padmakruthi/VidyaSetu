'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';
import { UserAvatar } from '@/components/UserAvatar';
import { StatusStepper } from '@/components/StatusStepper';
import { Application, DocumentItem } from '@/lib/types';
import { simulateDocumentOcr } from '@/lib/ocrEngine';
import Link from 'next/link';
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
  UserCheck,
  Building2,
  Calendar,
  MapPin,
  Printer,
  ArrowRight,
  X
} from 'lucide-react';
import { STWelfareOffice, VisitSlotBooking } from '@/lib/types';

export default function PortalPage() {
  const { currentUser, switchUser, lang } = useLanguage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [resubmitting, setResubmitting] = useState<boolean>(false);
  const [resubmitSuccess, setResubmitSuccess] = useState<boolean>(false);

  // Office Visit Slot Booking state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [offices, setOffices] = useState<STWelfareOffice[]>([]);
  const [selectedOfficeId, setSelectedOfficeId] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [bookedTimeSlots, setBookedTimeSlots] = useState<string[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const availableSlots = [
    '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM',
    '11:00 AM - 11:30 AM',
    '11:30 AM - 12:00 PM',
    '02:00 PM - 02:30 PM',
    '02:30 PM - 03:00 PM',
    '03:00 PM - 03:30 PM',
    '03:30 PM - 04:00 PM'
  ];

  // Fetch offices when modal opens
  useEffect(() => {
    if (bookingModalOpen) {
      fetch('/api/offices')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.offices.length > 0) {
            setOffices(data.offices);
            // Pre-select office matching user state if available
            const matched = data.offices.find(
              (o: STWelfareOffice) => o.state.toLowerCase() === currentUser?.state?.toLowerCase()
            );
            setSelectedOfficeId(matched ? matched.id : data.offices[0].id);
          }
        })
        .catch(console.error);
    }
  }, [bookingModalOpen, currentUser]);

  // Fetch booked slots when selected office or date changes
  useEffect(() => {
    if (selectedOfficeId && selectedDate) {
      fetch(`/api/offices?officeId=${selectedOfficeId}&date=${selectedDate}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.bookedSlots) {
            setBookedTimeSlots(data.bookedSlots);
          }
        })
        .catch(console.error);
    }
  }, [selectedOfficeId, selectedDate]);

  const handleConfirmSlotBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !selectedOfficeId || !selectedDate || !selectedTimeSlot) return;

    setBookingLoading(true);
    setBookingError(null);

    try {
      const res = await fetch(`/api/applications/${selectedApp.id}/book-visit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officeId: selectedOfficeId,
          date: selectedDate,
          timeSlot: selectedTimeSlot
        })
      });

      const data = await res.json();
      setBookingLoading(false);

      if (!res.ok || !data.success) {
        setBookingError(data.error || 'Failed to book office visit slot');
        return;
      }

      // Update selected application state
      const updated = { ...selectedApp, bookedVisitSlot: data.booking };
      setSelectedApp(updated);
      setApplications(prev => prev.map(a => (a.id === updated.id ? updated : a)));

      setBookingModalOpen(false);
    } catch (err: any) {
      setBookingLoading(false);
      setBookingError(err.message || 'Network error');
    }
  };

  const fetchUserApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications?applicantId=${currentUser.id}`);
      const data = await res.json();
      
      let matchedApps: Application[] = [];
      if (data.success && data.applications.length > 0) {
        matchedApps = data.applications;
      } else if (currentUser.email) {
        const allRes = await fetch('/api/applications');
        const allData = await allRes.json();
        if (allData.success) {
          matchedApps = allData.applications.filter(
            (a: Application) =>
              a.applicantId === currentUser.id ||
              (a.formData?.emailAddress &&
                a.formData.emailAddress.toLowerCase().trim() === currentUser.email.toLowerCase().trim())
          );
        }
      }

      setApplications(matchedApps);
      if (matchedApps.length > 0) {
        setSelectedApp(matchedApps[0]);
      } else {
        setSelectedApp(null);
      }
    } catch (e) {
      console.error(e);
      setSelectedApp(null);
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
      {/* Comprehensive Student Profile & Details Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center space-x-4">
            <UserAvatar name={currentUser.name} role={currentUser.role} sizeClassName="w-16 h-16 text-2xl" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{currentUser.name}</h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
                  ST Scholar
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Official Ministry Student Portal Account
              </p>
            </div>
          </div>
        </div>

        {/* Student Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Email Address</span>
            <span className="font-bold text-slate-900 font-mono text-xs">{currentUser.email || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Mobile Number</span>
            <span className="font-bold text-slate-900 font-mono text-xs">{currentUser.mobile || '—'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Domicile State / District</span>
            <span className="font-bold text-slate-900 text-xs">{currentUser.state} {currentUser.district ? `(${currentUser.district})` : ''}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Community / Tribe</span>
            <span className="font-bold text-slate-900 text-xs">{currentUser.community || 'Scheduled Tribe'}</span>
          </div>
        </div>

        {/* Applied For Summary Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 text-white p-4 rounded-xl">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono uppercase font-bold">Applied For:</span>
            {selectedApp ? (
              <span className="font-black text-amber-400 text-sm">
                {selectedApp.schemeCode} — {selectedApp.schemeTitle} ({selectedApp.id})
              </span>
            ) : (
              <span className="font-bold text-slate-400 text-xs italic">
                None (No Applications Submitted Yet)
              </span>
            )}
          </div>

          {selectedApp ? (
            <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2.5 py-1 rounded border border-emerald-500/30">
              Status: {selectedApp.status.replace(/_/g, ' ')}
            </span>
          ) : (
            <span className="text-xs bg-slate-800 text-slate-400 font-mono font-bold px-2.5 py-1 rounded border border-slate-700">
              Status: Not Applied
            </span>
          )}
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <RefreshCw className="w-8 h-8 mx-auto mb-2 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold">Loading scholar dashboard records...</p>
        </div>
      )}

      {/* When student has NOT applied for any scheme yet */}
      {!loading && !selectedApp && (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileCheck className="w-6 h-6" />
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-black text-slate-900">Scholarship Application Record</h3>
            <p className="text-xs text-slate-500">
              No fellowship or scholarship applications have been submitted from this account yet.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 max-w-lg mx-auto text-xs font-mono grid grid-cols-2 gap-3 text-left shadow-2xs">
            <div>
              <span className="text-slate-400 block text-[10px]">APPLIED SCHEME</span>
              <span className="font-bold text-slate-800">None</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">APPLICATION ID</span>
              <span className="font-bold text-slate-800">—</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">APPLICATION STATUS</span>
              <span className="font-bold text-amber-600">Not Submitted</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">SUBMISSION DATE</span>
              <span className="font-bold text-slate-800">—</span>
            </div>
          </div>
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

          {/* Confirmed Office Visit Pass Display */}
          {selectedApp.bookedVisitSlot && (
            <div className="bg-linear-to-r from-blue-900 via-slate-900 to-blue-950 text-white border-2 border-blue-500 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-blue-800/80 pb-4">
                <div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-3 py-1 rounded-full border border-emerald-500/30 inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Office Visit Slot Confirmed
                  </span>
                  <h3 className="text-xl font-black mt-2 text-white">Official Office Appointment Pass</h3>
                  <p className="text-xs text-blue-200">Show this pass along with your original documents to the welfare officer.</p>
                </div>
                <div className="text-right bg-blue-950/80 p-3 rounded-xl border border-blue-700/80 shrink-0 font-mono">
                  <span className="text-[10px] text-blue-300 block uppercase">Reference Number</span>
                  <span className="text-lg font-black text-amber-400">{selectedApp.bookedVisitSlot.referenceNo}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                  <span className="text-blue-300 font-bold block flex items-center gap-1">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    Appointed ST Welfare Office
                  </span>
                  <p className="font-bold text-white text-sm">{selectedApp.bookedVisitSlot.officeName}</p>
                  <p className="text-slate-300 text-[11px]">{selectedApp.bookedVisitSlot.officeAddress}</p>
                  <p className="text-amber-300 text-[11px] font-semibold mt-1">Officer: {selectedApp.bookedVisitSlot.contactOfficer}</p>
                </div>

                <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1">
                  <span className="text-emerald-300 font-bold block flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    Appointment Date & Time Slot
                  </span>
                  <p className="font-bold text-white text-sm">{selectedApp.bookedVisitSlot.date}</p>
                  <p className="text-emerald-400 font-mono text-xs font-bold">{selectedApp.bookedVisitSlot.timeSlot}</p>
                  <p className="text-slate-300 text-[11px] mt-1">Scholar: {selectedApp.bookedVisitSlot.applicantName}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-blue-800/80 text-[11px] text-slate-300">
                <div>
                  💡 <strong>Instructions:</strong> Please arrive 10 minutes prior to your slot. Bring original Caste, Income, and Academic certificates.
                </div>
                <button
                  onClick={() => window.print()}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Visit Pass</span>
                </button>
              </div>
            </div>
          )}

          {/* 1-Click Deficiency Resolution & Office Visit Options */}
          {hasActiveDeficiency && (
            <div className="bg-linear-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-400 rounded-2xl p-6 shadow-md space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Action Required: Document Deficiency Flagged</span>
                </div>
                <h3 className="text-xl font-black text-amber-950">
                  {selectedApp.deficiencyNotices[0].title}
                </h3>
                <p className="text-xs text-amber-900 leading-relaxed max-w-3xl">
                  {selectedApp.deficiencyNotices[0].reason}
                </p>
                <div className="p-3 bg-white/80 border border-amber-300 rounded-xl text-xs text-amber-950">
                  💡 <strong>Official Note:</strong> {selectedApp.deficiencyNotices[0].suggestedAction}
                </div>
              </div>

              {/* Two Distinct Resolution Choices */}
              <div className="border-t border-amber-300/80 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-950 mb-3">
                  Choose How You Wish To Resolve This Flag:
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: Online Re-upload */}
                  <div className="bg-white p-5 rounded-2xl border-2 border-emerald-300 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500 transition-all">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 text-emerald-800 text-xs font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <Upload className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Option 1: Fixable Document Issue</span>
                      </div>
                      <h5 className="font-black text-slate-900 text-sm">Resubmit Corrected Document Online</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        If you have a clear, valid certificate ready to upload, use our 1-click in-browser edge blur filter to resubmit immediately.
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={handleResolveDeficiency}
                        disabled={resubmitting}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
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
                      <span className="text-[10px] text-slate-500 font-mono text-center block mt-1">
                        Edge Blur Test (Var ≥ 100)
                      </span>
                    </div>
                  </div>

                  {/* Option 2: Office Visit Booking */}
                  <div className="bg-white p-5 rounded-2xl border-2 border-blue-300 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500 transition-all">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-1.5 text-blue-800 text-xs font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>Option 2: In-Person Consultation</span>
                      </div>
                      <h5 className="font-black text-slate-900 text-sm">Book ST Welfare Office Visit Slot</h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Prefer to discuss or dispute this flag in person? Book an appointment slot at your nearest ST Welfare Nodal Office.
                      </p>
                    </div>

                    <div>
                      <button
                        onClick={() => setBookingModalOpen(true)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>{selectedApp.bookedVisitSlot ? 'Reschedule Visit Slot' : 'Book Office Visit Appointment Slot'}</span>
                      </button>
                      <span className="text-[10px] text-slate-500 font-mono text-center block mt-1">
                        Fixed 30-Min Daily Slots
                      </span>
                    </div>
                  </div>
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
                  <span className="font-mono text-slate-700">XXXX-XXXX-{(selectedApp.formData.bankAccountNumber || selectedApp.formData.bankAccountNo || '4921').slice(-4)}</span>
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

      {/* Office Visit Appointment Booking Modal */}
      {bookingModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black">Book ST Welfare Office Visit</h3>
                  <p className="text-xs text-slate-300">Select your nearest nodal office and fixed 30-min time slot</p>
                </div>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleConfirmSlotBooking} className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
              {bookingError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              {/* Step 1: Select Welfare Office */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900 block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  1. Select Nearest ST Welfare Office
                </label>
                <select
                  value={selectedOfficeId}
                  onChange={e => setSelectedOfficeId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {offices.map(o => (
                    <option key={o.id} value={o.id}>
                      {o.name} ({o.state})
                    </option>
                  ))}
                </select>
                {selectedOfficeId && (
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-900 space-y-0.5">
                    <div className="font-bold">
                      {offices.find(o => o.id === selectedOfficeId)?.address}
                    </div>
                    <div className="text-[11px] text-blue-700">
                      Contact: {offices.find(o => o.id === selectedOfficeId)?.contactOfficer} • Tel: {offices.find(o => o.id === selectedOfficeId)?.phone}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Select Date */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900 block flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  2. Select Appointment Date
                </label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[1, 2, 3, 4, 5, 6, 7].map(daysAhead => {
                    const d = new Date(Date.now() + daysAhead * 86400000);
                    const isoDate = d.toISOString().split('T')[0];
                    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                    const monthDay = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const isSelected = selectedDate === isoDate;

                    return (
                      <button
                        key={isoDate}
                        type="button"
                        onClick={() => setSelectedDate(isoDate)}
                        className={`px-3 py-2 rounded-xl border text-center shrink-0 transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md font-bold'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-blue-300'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-mono">{dayName}</div>
                        <div className="text-xs font-bold">{monthDay}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Select Available Time Slot */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-900 block flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  3. Select Fixed 30-Minute Time Slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableSlots.map(slot => {
                    const isBooked = bookedTimeSlots.includes(slot);
                    const isSelected = selectedTimeSlot === slot;

                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`p-2.5 rounded-xl border text-center transition-all flex items-center justify-between ${
                          isBooked
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md font-bold'
                            : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-emerald-400'
                        }`}
                      >
                        <span className="font-mono text-[11px] font-bold">{slot}</span>
                        {isBooked ? (
                          <span className="text-[9px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded">
                            Booked
                          </span>
                        ) : isSelected ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
                {bookedTimeSlots.length > 0 && (
                  <p className="text-[10px] text-slate-500 font-mono">
                    ⚠️ Red slots have already been booked by another scholar.
                  </p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBookingModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading || !selectedTimeSlot}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md disabled:opacity-50 flex items-center gap-1.5"
                >
                  {bookingLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Confirming Booking...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Book Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
