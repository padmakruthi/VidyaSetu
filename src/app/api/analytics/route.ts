import { NextResponse } from 'next/server';
import { getApplications } from '@/lib/store';

export async function GET() {
  const apps = getApplications();

  const totalReceived = apps.length + 1420; // Combine with simulated historical baseline
  const verifiedCount = apps.filter(a => ['SCRUTINY_VERIFIED', 'COMMITTEE_SHORTLISTED', 'PROVISIONALLY_SELECTED'].includes(a.status)).length + 1180;
  const selectedCount = apps.filter(a => a.status === 'PROVISIONALLY_SELECTED').length + 540;
  const deficiencyCount = apps.filter(a => a.status === 'DEFICIENCY_FLAGGED').length + 195;
  const underScrutinyCount = apps.filter(a => a.status === 'UNDER_SCRUTINY' || a.status === 'SUBMITTED').length + 85;

  const stateWise: Record<string, number> = {
    'Odisha': 324,
    'Jharkhand': 288,
    'Madhya Pradesh': 245,
    'Chhattisgarh': 192,
    'Assam': 164,
    'Arunachal Pradesh': 88,
    'Meghalaya': 76,
    'Rajasthan': 65,
    'Telangana': 52,
    'Others': 46
  };

  const schemeWise = {
    'NFST': {
      title: 'National Fellowship for ST (NFST)',
      total: 1380,
      slots: 750,
      disbursedCrores: 42.6,
      sanctioned: 520
    },
    'NOS': {
      title: 'National Overseas Scholarship (NOS)',
      total: 160,
      slots: 20,
      disbursedCrores: 14.8,
      sanctioned: 20
    }
  };

  const deficiencyBreakdown = [
    { type: 'Income Certificate Outdated / Expired', count: 88, percentage: 42 },
    { type: 'Name Spelling / Initials Mismatch on Caste Cert', count: 46, percentage: 22 },
    { type: 'Blurry Scan / Low Resolution Camera Photo', count: 35, percentage: 17 },
    { type: 'Missing University Registrar / Guide Seal', count: 24, percentage: 11 },
    { type: 'Other Document Inconsistencies', count: 17, percentage: 8 }
  ];

  const tribeDistribution = [
    { tribe: 'Santhal', count: 280, state: 'Odisha / Jharkhand / WB' },
    { tribe: 'Gond', count: 245, state: 'MP / Chhattisgarh / Maharashtra' },
    { tribe: 'Bhil', count: 210, state: 'Rajasthan / MP / Gujarat' },
    { tribe: 'Munda', count: 185, state: 'Jharkhand / Odisha' },
    { tribe: 'Bodo', count: 120, state: 'Assam' },
    { tribe: 'Oraon / Kurukh', count: 115, state: 'Jharkhand / CG' },
    { tribe: 'Khasi & Garo', count: 95, state: 'Meghalaya' },
    { tribe: 'Monpa & Others', count: 70, state: 'Arunachal / NE' }
  ];

  return NextResponse.json({
    success: true,
    summary: {
      totalReceived,
      verifiedCount,
      selectedCount,
      deficiencyCount,
      underScrutinyCount,
      avgProcessingDaysAi: 4.2,
      avgProcessingDaysManual: 45.0,
      turnaroundImprovementPct: 90.6,
      aiAutoMatchRate: 94.2,
      totalDisbursedCrores: 57.4,
      dbtSuccessRate: 99.8
    },
    stateWise,
    schemeWise,
    deficiencyBreakdown,
    tribeDistribution
  });
}
