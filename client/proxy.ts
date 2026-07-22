import { NextRequest, NextResponse } from 'next/server';

function isTokenExpired(token: string) {
  try {
    const payloadBase64 = token.split('.')[1];
    // Next.js Edge runtime supports atob, so we use it instead of Buffer
    const decodedJson = atob(payloadBase64);
    const decoded = JSON.parse(decodedJson);
    if (!decoded.exp) return false;
    return decoded.exp < Date.now() / 1000;
  } catch (e) {
    return true; // if parsing fails, assume it's invalid/expired
  }
}

/**
 * Route protection proxy.
 *
 * Strategy: We store two cookies on login —
 *   rydway_token  – the JWT (for API calls via SSR if ever needed)
 *   rydway_role   – 'renter' | 'host' | 'admin'  (safe to read on edge)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('rydway_token')?.value;
  const role = request.cookies.get('rydway_role')?.value;

  const isExpired = token ? isTokenExpired(token) : false;

  // 1. Prevent authenticated users from accessing auth pages
  if (pathname.startsWith('/auth')) {
    if (token && !isExpired) {
      const dashboardUrl = request.nextUrl.clone();
      if (role === 'host') {
        dashboardUrl.pathname = '/dashboard/business';
      } else if (role === 'admin') {
        dashboardUrl.pathname = '/dashboard/admin';
      } else {
        dashboardUrl.pathname = '/dashboard/renter';
      }
      return NextResponse.redirect(dashboardUrl);
    }
    
    // Clear cookies if expired so they don't stick around
    if (isExpired) {
       const res = NextResponse.next();
       res.cookies.delete('rydway_token');
       res.cookies.delete('rydway_role');
       return res;
    }
    return NextResponse.next();
  }

  // Guard dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // 2. Not authenticated or token expired → redirect to login
    if (!token || isExpired) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/auth';
      loginUrl.searchParams.set('from', pathname);
      const res = NextResponse.redirect(loginUrl);
      if (isExpired) {
        res.cookies.delete('rydway_token');
        res.cookies.delete('rydway_role');
      }
      return res;
    }

    // Admins bypass role checks
    if (role === 'admin') {
      return NextResponse.next();
    }

    const isBusinessRoute = pathname.startsWith('/dashboard/business');
    const isRenterRoute = pathname.startsWith('/dashboard/renter');

    // 3. Renter trying to access business area
    if (role === 'renter' && isBusinessRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/dashboard/renter';
      return NextResponse.redirect(redirectUrl);
    }

    // 4. Host trying to access renter area
    if (role === 'host' && isRenterRoute) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/dashboard/business';
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/:path*', '/auth'],
  runtime: 'experimental-edge',
};
