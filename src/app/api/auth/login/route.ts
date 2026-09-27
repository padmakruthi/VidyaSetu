import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { initialUsers, setCurrentUser } from '@/lib/store';
import { createRedisSession } from '@/lib/redisSession';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, loginType, selectedAdminRole } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = initialUsers.find(
      u => u.email.toLowerCase() === email.toLowerCase().trim()
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password if hash exists
    if (user.passwordHash) {
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    }

    // Role-match override for admin login dropdown (as required by specification)
    if (loginType === 'ADMIN' && selectedAdminRole) {
      user.role = selectedAdminRole;
    } else if (loginType === 'STUDENT') {
      user.role = 'APPLICANT';
    }

    setCurrentUser(user);

    // Create session in Redis Session Store
    const sessionId = await createRedisSession(user.id, user.role, user.email);

    const response = NextResponse.json({
      success: true,
      user,
      sessionId
    });

    // Set vidyasetu_session_id cookie
    response.cookies.set('vidyasetu_session_id', sessionId, {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    response.cookies.set('vidyasetu_current_user', JSON.stringify(user), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
