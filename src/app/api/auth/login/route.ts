import { NextRequest, NextResponse } from 'next/server';
import { initialUsers, setCurrentUser } from '@/lib/store';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, role, userId } = body;

    let user = initialUsers.find(u => u.id === userId);
    if (!user && email) {
      user = initialUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    }
    if (!user && role) {
      user = initialUsers.find(u => u.role === role);
    }
    if (!user) {
      // Default fallback
      user = initialUsers[0];
    }

    setCurrentUser(user);
    const token = signToken(user);

    const response = NextResponse.json({
      success: true,
      user,
      token
    });

    response.cookies.set('vidyasetu_token', token, {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
