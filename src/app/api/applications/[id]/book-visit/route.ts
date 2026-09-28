import { NextRequest, NextResponse } from 'next/server';
import { bookOfficeVisitSlot, getApplicationById } from '@/lib/store';
import { sendOfficeVisitBookingEmail } from '@/lib/mailer';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: appId } = await params;
    const body = await request.json();
    const { officeId, date, timeSlot } = body;

    if (!officeId || !date || !timeSlot) {
      return NextResponse.json(
        { success: false, error: 'Office ID, date, and time slot are required' },
        { status: 400 }
      );
    }

    const app = getApplicationById(appId);
    if (!app) {
      return NextResponse.json(
        { success: false, error: 'Application not found' },
        { status: 404 }
      );
    }

    const booking = bookOfficeVisitSlot(appId, officeId, date, timeSlot);

    if (app.formData?.emailAddress) {
      sendOfficeVisitBookingEmail({
        toEmail: app.formData.emailAddress,
        applicantName: app.applicantName,
        applicationId: app.id,
        officeName: booking.officeName,
        officeAddress: booking.officeAddress,
        date: booking.date,
        timeSlot: booking.timeSlot,
        contactOfficer: booking.contactOfficer,
        referenceNo: booking.referenceNo
      }).catch(err => console.error('[SMTP] Office visit booking email error:', err));
    }

    return NextResponse.json({
      success: true,
      booking
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to book slot' },
      { status: 400 }
    );
  }
}
