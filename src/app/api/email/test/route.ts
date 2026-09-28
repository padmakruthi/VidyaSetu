import { NextRequest, NextResponse } from 'next/server';
import { getSmtpConfig, sendApplicationStatusUpdateEmail } from '@/lib/mailer';

export async function GET() {
  const config = getSmtpConfig();
  return NextResponse.json({
    success: true,
    configured: config.isConfigured,
    smtpEmail: config.smtpEmail,
    instructions: config.isConfigured
      ? 'SMTP credentials are fully configured. Real emails will be sent.'
      : 'SMTP_APP_PASSWORD is not set in .env.local. Generate a 16-character Google App Password in your Google Account and save it into .env.local.'
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config = getSmtpConfig();
    const toEmail = body.toEmail || config.smtpEmail;

    const result = await sendApplicationStatusUpdateEmail({
      toEmail,
      applicantName: body.applicantName || 'Scholar Test User',
      applicationId: body.applicationId || 'MOTA-NFST-2025-TEST',
      schemeTitle: 'National Fellowship for Scheduled Tribe Students (NFST)',
      status: 'SCRUTINY_VERIFIED',
      statusTitle: 'Email Feature Test Verification',
      message: 'This is a test notification confirming that the VidyaSetu Gmail SMTP integration is functioning properly.',
      remarks: 'Automated test dispatch triggered successfully.',
      actionRequired: 'No action required.'
    });

    return NextResponse.json({
      success: result.success,
      emailSent: result.emailSent,
      targetEmail: toEmail,
      result
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
