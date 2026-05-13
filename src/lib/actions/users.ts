'use server';

import { z } from 'zod';
import db from '@/lib/db';
import { hashPassword } from '@/lib/password';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';

const facilitatorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_@.]+$/, 'Invalid username format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function createFacilitator(prevState: unknown, formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return { error: 'Unauthorized. Only admins can create facilitators.' };
  }

  const result = facilitatorSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const firstError = result.error.issues[0];
    return { error: firstError.message };
  }

  const { name, username, password } = result.data;

  try {
    const existingUser = await db.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return { error: 'This username is already taken.' };
    }

    const passwordHash = await hashPassword(password);

    await db.user.create({
      data: {
        name,
        username,
        passwordHash,
        role: 'FACILITATOR',
      },
    });

    revalidatePath('/users');
    return { success: true };
  } catch (error) {
    console.error('Create facilitator error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}
