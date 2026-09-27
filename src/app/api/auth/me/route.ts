import { NextRequest, NextResponse } from 'next/server';
import { getRedisSession } from '@/lib/redisSession';
import { initialUsers } from '@/lib/store';

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('vidyasetu_session_id')?.value;
    if (!sessionId) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = await getRedisSession(sessionId);
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const user = initialUsers.find(u => u.id === session.userId);
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Ensure role matches active session
    user.role = session.role;

    return NextResponse.json({
      authenticated: true,
      user,
      session
    });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}
