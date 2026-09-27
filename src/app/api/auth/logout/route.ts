import { NextRequest, NextResponse } from 'next/server';
import { destroyRedisSession } from '@/lib/redisSession';

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('vidyasetu_session_id')?.value;
    if (sessionId) {
      await destroyRedisSession(sessionId);
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });

    response.cookies.delete('vidyasetu_session_id');
    response.cookies.delete('vidyasetu_current_user');
    response.cookies.delete('vidyasetu_token');

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
