import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions, type SessionData } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(request, res, sessionOptions);

  const { user } = session;
  const { pathname } = request.nextUrl;

  // Public routes
  if (pathname === '/' || pathname === '/login' || pathname === '/scoreboard') {
    if (user && pathname !== '/scoreboard') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return res;
  }

  // Protected routes
  const protectedRoutes = [
    '/dashboard', 
    '/games', 
    '/techops', 
    '/bounty', 
    '/teams', 
    '/scores', 
    '/edit-requests', 
    '/users', 
    '/settings'
  ];
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Admin-only routes
  const adminOnlyRoutes = ['/users', '/settings'];
  const isAdminOnlyRoute = adminOnlyRoutes.some(route => pathname.startsWith(route));

  if (isAdminOnlyRoute && user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/games/:path*',
    '/techops/:path*',
    '/bounty/:path*',
    '/teams/:path*',
    '/scores/:path*',
    '/edit-requests/:path*',
    '/users/:path*',
    '/settings/:path*',
    '/login',
    '/'
  ],
};
