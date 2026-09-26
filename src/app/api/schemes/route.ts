import { NextRequest, NextResponse } from 'next/server';
import { getSchemes, updateSchemeRulesInStore } from '@/lib/store';

export async function GET() {
  const schemes = getSchemes();
  return NextResponse.json({ success: true, schemes });
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { schemeId, rules } = body;

    const updated = updateSchemeRulesInStore(schemeId, rules);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Scheme not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, scheme: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
