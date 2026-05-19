'use server';

import { z } from 'zod';
import db from '@/lib/db';
import { verifyPassword } from '@/lib/password';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

const loginSchema = z.object({
  username: z.string().min(1, 'Please enter your username.'),
  password: z.string().min(1, 'Please enter your password.'),
});

export async function login(prevState: unknown, formData: FormData) {
  const result = loginSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    return { error: 'Please enter your username and password.' };
  }

  const { username, password } = result.data;

  try {
    const user = await db.user.findUnique({ 
      where: { username },
    });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return { error: 'Username or password is incorrect.' };
    }

    // Start session
    const session = await getSession();
    session.user = {
      id: user.id,
      username: user.username,
      displayName: user.name,
      role: user.role as 'ADMIN' | 'FACILITATOR',
    };
    await session.save();

  } catch (error) {
    console.error('[AUTH_ACTION_ERROR]:', error instanceof Error ? error.message : error);
    
    // Check for common Prisma connection errors to give better feedback
    const errorMessage = error instanceof Error ? error.message : '';
    if (errorMessage.includes('Can\'t reach database')) {
      return { error: 'Database connection failed. Please check your DATABASE_URL.' };
    }
    
    return { error: 'Something went wrong. Please check server logs or re-seed database.' };
  }

  redirect('/dashboard');
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect('/login');
}
