import { NextRequest, NextResponse } from 'next/server';
import { sendRealOtpEmail } from '@/lib/mailer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, otp, firstName, lastName } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP code are required' },
        { status: 400 }
      );
    }

    const studentName = firstName ? `${firstName} ${lastName || ''}`.trim() : undefined;

    const result = await sendRealOtpEmail({
      toEmail: email.trim(),
      otp: otp.trim(),
      studentName
    });

    return NextResponse.json({
      success: true,
      emailSent: result.emailSent,
      message: result.message
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
