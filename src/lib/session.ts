import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { cache } from 'react';
import db from './db';

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

export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session.user) return null;

  // Verify user still exists in the database (critical for DB migrations)
  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, username: true, name: true, role: true }
    });

    if (!user) {
      // User ID from cookie doesn't exist in current DB
      session.destroy();
      return null;
    }

    return session.user;
  } catch (error) {
    return null;
  }
});
