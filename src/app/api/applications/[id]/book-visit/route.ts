import { NextRequest, NextResponse } from 'next/server';
import { bookOfficeVisitSlot, getApplicationById } from '@/lib/store';

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
