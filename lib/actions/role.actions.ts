'use server';

import { connectToDatabase } from "@/database/mongoose";
import { ROLES, type UserRole, hasMinimumRole, getRoleLimits } from "@/lib/constants/roles";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";

/**
 * Get the current user's session with role information
 */
export const getCurrentUser = async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return null;

    // Fetch full user data including role from database
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) return null;

    const user = await db.collection('user').findOne<{
      _id?: unknown;
      id?: string;
      email?: string;
      name?: string;
      role?: UserRole;
    }>({ email: session.user.email });

    return {
      ...session.user,
      role: (user?.role as UserRole) || ROLES.USER,
    };
  } catch (e) {
    console.error('Error getting current user:', e);
    return null;
  }
};

/**
 * Get a user's role by their ID
 */
export const getUserRole = async (userId: string): Promise<UserRole> => {
  try {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) return ROLES.USER;

    const user = await db.collection('user').findOne(
      { $or: [{ id: userId }, { _id: userId }] } as any,
      { projection: { role: 1 } }
    ) as { role?: string } | null;

    return (user?.role as UserRole) || ROLES.USER;
  } catch (e) {
    console.error('Error getting user role:', e);
    return ROLES.USER;
  }
};

/**
 * Update a user's role (admin only)
 */
export const updateUserRole = async (userId: string, newRole: UserRole): Promise<{ success: boolean; error?: string }> => {
  try {
    // Verify current user is admin
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== ROLES.ADMIN) {
      return { success: false, error: 'Unauthorized: Admin access required' };
    }

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) return { success: false, error: 'Database connection failed' };

    const result = await db.collection('user').updateOne(
      { $or: [{ id: userId }, { _id: userId }] } as any,
      { $set: { role: newRole } }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: 'User not found' };
    }

    return { success: true };
  } catch (e) {
    console.error('Error updating user role:', e);
    return { success: false, error: 'Failed to update role' };
  }
};

/**
 * Check if current user is an admin
 */
export const isCurrentUserAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return user?.role === ROLES.ADMIN;
};

/**
 * Check if current user has at least premium access
 */
export const isCurrentUserPremium = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;
  return hasMinimumRole(user.role, ROLES.PREMIUM);
};

/**
 * Get feature limits for current user based on their role
 */
export const getCurrentUserLimits = async () => {
  const user = await getCurrentUser();
  const role = user?.role || ROLES.USER;
  return getRoleLimits(role);
};
