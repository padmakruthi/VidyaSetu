import { UserRole } from './types';

export interface SessionData {
  sessionId: string;
  userId: string;
  role: UserRole;
  email: string;
  createdAt: number;
  expiresAt: number;
}

// In-memory Redis Key-Value Store Map (simulating Redis KV backend)
const globalForSession = global as unknown as {
  redisSessionStore: Map<string, SessionData>;
};

export const sessionStore =
  globalForSession.redisSessionStore || new Map<string, SessionData>();

if (process.env.NODE_ENV !== 'production') {
  globalForSession.redisSessionStore = sessionStore;
}

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days TTL

export async function createRedisSession(
  userId: string,
  role: UserRole,
  email: string
): Promise<string> {
  const sessionId = `sess_${Math.random().toString(36).substring(2)}_${Date.now()}`;
  const now = Date.now();
  const session: SessionData = {
    sessionId,
    userId,
    role,
    email,
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS
  };

  sessionStore.set(`session:${sessionId}`, session);
  return sessionId;
}

export async function getRedisSession(sessionId?: string): Promise<SessionData | null> {
  if (!sessionId) return null;
  const session = sessionStore.get(`session:${sessionId}`);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    sessionStore.delete(`session:${sessionId}`);
    return null;
  }

  return session;
}

export async function destroyRedisSession(sessionId?: string): Promise<boolean> {
  if (!sessionId) return false;
  return sessionStore.delete(`session:${sessionId}`);
}
