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

const updateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_@.]+$/, 'Invalid username format'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.password && data.password.length > 0) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function updateUser(userId: string, prevState: unknown, formData: FormData) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return { error: 'Unauthorized.' };

  // Permission check: Admin can update anyone, Facilitator can only update themselves
  const isSelf = currentUser.id === userId;
  const isAdmin = currentUser.role === 'ADMIN';

  if (!isAdmin && !isSelf) {
    return { error: 'Unauthorized. You can only update your own account.' };
  }

  const result = updateSchema.safeParse(Object.fromEntries(formData));

  if (!result.success) {
    const firstError = result.error.issues[0];
    return { error: firstError.message };
  }

  const { name, username, password } = result.data;

  try {
    const existingUser = await db.user.findUnique({
      where: { username },
    });

    if (existingUser && existingUser.id !== userId) {
      return { error: 'This username is already taken.' };
    }

    const data: any = {
      name,
      username,
    };

    if (password && password.length > 0) {
      data.passwordHash = await hashPassword(password);
    }

    await db.user.update({
      where: { id: userId },
      data,
    });

    revalidatePath('/users');
    return { success: true };
  } catch (error) {
    console.error('Update user error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}

export async function deleteUser(userId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return { error: 'Unauthorized. Only admins can delete accounts.' };
  }

  if (currentUser.id === userId) {
    return { error: 'You cannot delete your own admin account.' };
  }

  try {
    await db.user.delete({
      where: { id: userId },
    });

    revalidatePath('/users');
    return { success: true };
  } catch (error) {
    console.error('Delete user error:', error);
    return { error: 'Failed to delete user.' };
  }
}
