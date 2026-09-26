import { NextRequest, NextResponse } from 'next/server';
import { getApplicationById, updateApplication } from '@/lib/store';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const application = getApplicationById(id);

  if (!application) {
    return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, application });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const updates = await request.json();
    const updated = updateApplication(id, updates);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
