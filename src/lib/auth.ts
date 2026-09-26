import jwt from 'jsonwebtoken';
import { User, UserRole } from './types';
import { initialUsers } from './store';

const JWT_SECRET = process.env.JWT_SECRET || 'vidyasetu_mota_hackathon_super_secret_jwt_key_2025';

export interface AuthTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export function signToken(user: User): string {
  const payload: AuthTokenPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): AuthTokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch (error) {
    return null;
  }
}

export function getUserFromToken(token?: string): User | null {
  if (!token) return null;
  const payload = verifyToken(token);
  if (!payload) return null;
  return initialUsers.find(u => u.id === payload.userId) || null;
}
