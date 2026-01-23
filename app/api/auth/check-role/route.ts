import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/better-auth/auth";
import { connectToDatabase } from "@/database/mongoose";
import { ROLES, type UserRole } from "@/lib/constants/roles";

export async function GET(request: NextRequest) {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: request.headers
    });

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated', role: null },
        { status: 401 }
      );
    }

    // Fetch user's role from database
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if (!db) {
      return NextResponse.json(
        { error: 'Database connection failed', role: ROLES.USER },
        { status: 500 }
      );
    }

    const user = await db.collection('user').findOne<{ role?: UserRole }>(
      { email: session.user.email },
      { projection: { role: 1 } }
    );

    const role = user?.role || ROLES.USER;

    return NextResponse.json({
      role,
      email: session.user.email,
      isAdmin: role === ROLES.ADMIN,
      isPremium: role === ROLES.PREMIUM || role === ROLES.ADMIN,
    });
  } catch (error) {
    console.error('Role check error:', error);
    return NextResponse.json(
      { error: 'Failed to check role', role: ROLES.USER },
      { status: 500 }
    );
  }
}
