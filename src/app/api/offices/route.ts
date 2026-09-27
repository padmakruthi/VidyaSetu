import { NextRequest, NextResponse } from 'next/server';
import { getSTWelfareOffices, getBookedSlots } from '@/lib/store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const officeId = searchParams.get('officeId');
  const date = searchParams.get('date');

  const offices = getSTWelfareOffices();

  if (officeId && date) {
    const bookedSlots = getBookedSlots(officeId, date);
    return NextResponse.json({
      success: true,
      offices,
      bookedSlots
    });
  }

  return NextResponse.json({
    success: true,
    offices
  });
}
