'use client';

import React from 'react';
import { ApplicationStatus, LifecycleStage } from '@/lib/types';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Send,
  Building2,
  CreditCard,
  RefreshCw,
  Sparkles
} from 'lucide-react';

interface StatusStepperProps {
  status: ApplicationStatus;
  lifecycleStage?: LifecycleStage;
  submittedAt?: string;
  updatedAt?: string;
  hasDeficiency?: boolean;
  pfmsUtr?: string;
}

export function StatusStepper({
  status,
  lifecycleStage = 'DATA_CROSS_CHECKED',
  submittedAt,
  updatedAt,
  hasDeficiency = false,
  pfmsUtr
}: StatusStepperProps) {
  // 5-Stage Lifecycle Audit Trail from PPT Slide 2
  const lifecycleStages: { id: LifecycleStage; label: string; icon: any }[] = [
    { id: 'IDENTITY_VERIFIED', label: 'IDENTITY VERIFIED', icon: ShieldCheck },
    { id: 'DOCS_VALIDATED', label: 'DOCS VALIDATED', icon: FileCheck },
    { id: 'DATA_CROSS_CHECKED', label: 'DATA CROSS-CHECKED', icon: Sparkles },
    { id: 'FUNDS_TRACKED', label: 'FUNDS TRACKED', icon: CreditCard },
    { id: 'RENEWAL_MONITORED', label: 'RENEWAL MONITORED', icon: RefreshCw }
  ];

  const stageOrder: LifecycleStage[] = [
    'IDENTITY_VERIFIED',
    'DOCS_VALIDATED',
    'DATA_CROSS_CHECKED',
    'FUNDS_TRACKED',
    'RENEWAL_MONITORED'
  ];

  const currentStageIndex = stageOrder.indexOf(lifecycleStage);

  // Application workflow steps
  const steps = [
    {
      id: 'SUBMITTED',
      title: 'Application Submitted',
      sub: submittedAt ? new Date(submittedAt).toLocaleDateString() : 'DigiLocker Ingest',
      active: true,
      done: true
    },
    {
      id: 'SCRUTINY',
      title: 'Spotlight AI Scrutiny',
      sub: hasDeficiency
        ? 'Deficiency Action Required'
        : ['SCRUTINY_VERIFIED', 'COMMITTEE_SHORTLISTED', 'PROVISIONALLY_SELECTED'].includes(status)
        ? 'Verified in 30s'
        : 'In Queue (< 48 hrs)',
      active: status !== 'DRAFT',
      done: ['SCRUTINY_VERIFIED', 'COMMITTEE_SHORTLISTED', 'PROVISIONALLY_SELECTED'].includes(status),
      warning: status === 'DEFICIENCY_FLAGGED'
    },
    {
      id: 'COMMITTEE',
      title: 'Selection Committee',
      sub: ['COMMITTEE_SHORTLISTED', 'PROVISIONALLY_SELECTED'].includes(status)
        ? 'Merit Shortlisted'
        : 'Pending Quota Review',
      active: ['SCRUTINY_VERIFIED', 'COMMITTEE_SHORTLISTED', 'PROVISIONALLY_SELECTED'].includes(status),
      done: ['COMMITTEE_SHORTLISTED', 'PROVISIONALLY_SELECTED'].includes(status)
    },
    {
      id: 'SANCTION',
      title: 'PFMS DBT Sanction',
      sub: status === 'PROVISIONALLY_SELECTED'
        ? pfmsUtr ? `UTR: ${pfmsUtr}` : 'Disbursed to Bank'
        : 'Awaiting Final Sanction',
      active: status === 'PROVISIONALLY_SELECTED',
      done: status === 'PROVISIONALLY_SELECTED'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 1. Sovereign 5-Stage Lifecycle Audit Trail (Directly from PPT Slide 2) */}
      <div className="bg-slate-900 text-white rounded-xl p-4 shadow-md border border-slate-800">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
              AUDIT TRAIL (SIH Sovereign Lifecycle Protocol)
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
            DPDP-Compliant • 48-Hour SLA
          </span>
        </div>

        {/* 5-Stage Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {lifecycleStages.map((stage, idx) => {
            const isCompleted = idx <= currentStageIndex;
            const isCurrent = idx === currentStageIndex;
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                className={`p-2 rounded-lg border text-center transition-all ${
                  isCurrent
                    ? 'bg-blue-950/90 border-blue-500 shadow-sm shadow-blue-500/20 ring-1 ring-blue-400'
                    : isCompleted
                    ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                    : 'bg-slate-800/40 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex justify-center mb-1">
                  <Icon
                    className={`w-4 h-4 ${
                      isCurrent
                        ? 'text-blue-400 animate-bounce'
                        : isCompleted
                        ? 'text-emerald-400'
                        : 'text-slate-600'
                    }`}
                  />
                </div>
                <div className={`text-[10px] font-bold tracking-tight ${isCurrent ? 'text-white' : ''}`}>
                  {stage.label}
                </div>
                <div className="text-[9px] mt-0.5 opacity-80">
                  {isCompleted ? '✓ Completed' : isCurrent ? '● Processing' : '○ Upcoming'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Visual Status Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          Application Workflow Milestones
        </h3>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-slate-200 -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={`flex md:flex-col items-center md:items-center text-left md:text-center p-3 rounded-xl border transition-all ${
                  step.warning
                    ? 'bg-amber-50/80 border-amber-300 text-amber-900'
                    : step.done
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : step.active
                    ? 'bg-blue-50/70 border-blue-300 text-blue-950'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                {/* Node icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 md:mb-2 shadow-xs ${
                    step.warning
                      ? 'bg-amber-500 text-white'
                      : step.done
                      ? 'bg-emerald-600 text-white'
                      : step.active
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step.warning ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : step.done ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="font-bold text-xs">{idx + 1}</span>
                  )}
                </div>

                <div className="ml-3 md:ml-0">
                  <div className="text-xs font-bold leading-tight">{step.title}</div>
                  <div
                    className={`text-[11px] mt-0.5 ${
                      step.warning ? 'text-amber-700 font-semibold' : 'text-slate-500'
                    }`}
                  >
                    {step.sub}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
