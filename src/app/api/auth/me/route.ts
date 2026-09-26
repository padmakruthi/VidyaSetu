import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { getCurrentUser } from '@/lib/store';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('vidyasetu_token')?.value ||
                request.headers.get('Authorization')?.replace('Bearer ', '');

  if (token) {
    const user = getUserFromToken(token);
    if (user) {
      return NextResponse.json({ success: true, user });
    }
  }

  // Fallback to active in-memory user
  return NextResponse.json({ success: true, user: getCurrentUser() });
}
