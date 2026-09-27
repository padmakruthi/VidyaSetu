import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { initialUsers, addUser, setCurrentUser } from '@/lib/store';
import { createRedisSession } from '@/lib/redisSession';
import { User } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, mobile, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'First name, last name, email, and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = initialUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: `${firstName} ${lastName}`.trim(),
      email: cleanEmail,
      mobile: mobile || '9876543210',
      role: 'APPLICANT',
      state: 'Odisha',
      community: 'ST Scholar',
      passwordHash
    };

    addUser(newUser);
    setCurrentUser(newUser);

    // Create session in Redis Session Store
    const sessionId = await createRedisSession(newUser.id, newUser.role, newUser.email);

    const response = NextResponse.json({
      success: true,
      user: newUser,
      sessionId
    });

    response.cookies.set('vidyasetu_session_id', sessionId, {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    response.cookies.set('vidyasetu_current_user', JSON.stringify(newUser), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
