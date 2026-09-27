import { NextRequest, NextResponse } from 'next/server';
import { getApplications, createApplication } from '@/lib/store';
import { computeAiMetrics } from '@/lib/ocrEngine';
import { Application } from '@/lib/types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const scheme = searchParams.get('scheme');
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const applicantId = searchParams.get('applicantId');

  let list = getApplications();

  if (scheme && scheme !== 'ALL') {
    list = list.filter(a => a.schemeCode.toLowerCase() === scheme.toLowerCase() || a.schemeId.toLowerCase() === scheme.toLowerCase());
  }

  if (status && status !== 'ALL') {
    list = list.filter(a => a.status === status);
  }

  if (applicantId) {
    list = list.filter(a => a.applicantId === applicantId);
  }

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(a =>
      a.id.toLowerCase().includes(q) ||
      a.applicantName.toLowerCase().includes(q) ||
      a.applicantTribe.toLowerCase().includes(q) ||
      a.applicantState.toLowerCase().includes(q)
    );
  }

  return NextResponse.json({ success: true, applications: list, total: list.length });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { schemeId, formData, documents = [] } = body;

    const schemeCode = schemeId === 'nos' ? 'NOS' : 'NFST';
    const schemeTitle = schemeId === 'nos'
      ? 'National Overseas Scholarship for ST Candidates (NOS)'
      : 'National Fellowship for Scheduled Tribe Students (NFST)';

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const id = `MOTA-${schemeCode}-2025-${randomSuffix}`;

    const aiMetrics = computeAiMetrics(formData, documents);

    const newApplication: Application = {
      id,
      schemeId,
      schemeCode,
      schemeTitle,
      applicantId: body.applicantId || `user-${Date.now()}`,
      applicantName: formData.fullName || 'Tribal Scholar',
      applicantTribe: formData.tribeCommunity || 'Santhal',
      applicantState: formData.state || 'Odisha',
      gender: formData.gender || 'MALE',
      status: 'SUBMITTED',
      currentLifecycleStage: 'DOCS_VALIDATED',
      formData,
      documents,
      deficiencyNotices: [],
      verificationLogs: [
        {
          id: `log-${Date.now()}`,
          applicationId: id,
          officerName: 'Applicant Self-Submission',
          officerRole: 'APPLICANT',
          action: 'FIELD_VERIFIED',
          details: 'Application submitted with AI document pre-scrutiny completed.',
          timestamp: new Date().toISOString()
        }
      ],
      aiRiskScore: aiMetrics.riskScore,
      aiCompletenessScore: aiMetrics.completenessScore,
      aiRecommendation: aiMetrics.recommendation,
      aiHighlights: aiMetrics.highlights,
      avgJaroWinklerScore: aiMetrics.avgJaroWinklerScore,
      bhashiniDialectResolution: aiMetrics.bhashiniDialectResolution,
      edgeIqaStatus: aiMetrics.edgeIqaStatus,
      meritScore: aiMetrics.meritScore,
      autoRank: Math.floor(1 + Math.random() * 20),
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = createApplication(newApplication);

    return NextResponse.json({ success: true, application: saved });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
