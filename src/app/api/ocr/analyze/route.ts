import { NextRequest, NextResponse } from 'next/server';
import { simulateDocumentOcr } from '@/lib/ocrEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { docType, fileName, formData = {}, forceDeficiency = false } = body;

    const result = simulateDocumentOcr(docType, fileName || 'document.pdf', formData, forceDeficiency);

    return NextResponse.json({
      success: true,
      result
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
