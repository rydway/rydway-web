import { NextRequest, NextResponse } from 'next/server';

/**
 * Route protection middleware.
 *
 * Strategy: We store two cookies on login —
 *   rydway_token  – the JWT (for API calls via SSR if ever needed)
 *   rydway_role   – 'renter' | 'host' | 'admin'  (safe to read on edge)
 *
 * The AuthContext sets these cookies whenever it calls login().
 *
 * Rules:
 *  1. Unauthenticated users visiting /dashboard/* → /auth/login
 *  2. Renter visiting /dashboard/business/*       → /dashboard/renter
 *  3. Host/business visiting /dashboard/renter/*  → /dashboard/business
 *  4. Admin can visit all routes.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only guard dashboard routes
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('rydway_token')?.value;
  const role = request.cookies.get('rydway_role')?.value;   // 'renter' | 'host' | 'admin'

  // 1. Not authenticated → redirect to login
  if (!token) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/auth';
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admins bypass role checks
  if (role === 'admin') {
    return NextResponse.next();
  }

  const isBusinessRoute = pathname.startsWith('/dashboard/business');
  const isRenterRoute = pathname.startsWith('/dashboard/renter');

  // 2. Renter trying to access business area
  if (role === 'renter' && isBusinessRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard/renter';
    return NextResponse.redirect(redirectUrl);
  }

  // 3. Host trying to access renter area
  if (role === 'host' && isRenterRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard/business';
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
