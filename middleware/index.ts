import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Admin routes that require admin role
const ADMIN_ROUTES = ['/admin'];

// Check if path starts with any admin route
const isAdminRoute = (pathname: string) => {
    return ADMIN_ROUTES.some(route => pathname.startsWith(route));
};

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    // If no session, redirect to sign-in (except for public routes)
    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // For admin routes, we need to verify the role
    // This is done via API since middleware can't directly access MongoDB
    if (isAdminRoute(pathname)) {
        try {
            // Call our role check API
            const roleCheckUrl = new URL('/api/auth/check-role', request.url);
            const response = await fetch(roleCheckUrl, {
                headers: {
                    cookie: request.headers.get('cookie') || '',
                },
            });

            if (response.ok) {
                const data = await response.json();
                if (data.role !== 'admin') {
                    // Redirect non-admins to home
                    return NextResponse.redirect(new URL("/", request.url));
                }
            } else {
                // If role check fails, redirect to home
                return NextResponse.redirect(new URL("/", request.url));
            }
        } catch (error) {
            console.error('Role check failed:', error);
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sign-in|sign-up|assets).*)',
    ],
};

