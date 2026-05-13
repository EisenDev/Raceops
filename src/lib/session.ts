import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  user?: {
    id: string;
    username: string;
    displayName: string;
    role: 'ADMIN' | 'FACILITATOR';
  };
}

export const sessionOptions = {
  password: process.env.IRON_SESSION_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'techops_cache_run_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  return session;
}

export async function getCurrentUser() {
  const session = await getSession();
  return session.user;
}
