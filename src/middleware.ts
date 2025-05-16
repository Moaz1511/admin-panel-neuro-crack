import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AppConstants } from '@/lib/utils/app-constants'

// Function to check if a route is public (no auth needed)
function isPublicRoute(pathname: string): boolean {
  const publicRoutes = [
    AppConstants.routes.login,
    AppConstants.routes.signup,
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
    // Add any other public paths here
  ];
  return publicRoutes.some(route => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // Allow requests to API routes, static files, and Next.js specific paths to pass through
  if (
    pathname.startsWith('/_next/') || // Next.js internal assets
    pathname.startsWith('/api/') || // API routes
    pathname.includes('.') // Static files (e.g., .png, .ico)
  ) {
    return NextResponse.next();
  }

  // If trying to access a protected route without authentication
  if (!refreshToken && !isPublicRoute(pathname)) {
    const loginUrl = new URL(AppConstants.routes.login, request.url);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set('from', pathname);
    
    const response = NextResponse.redirect(loginUrl);
    
    // Clear any existing tokens just in case
    response.cookies.delete('refresh_token');
    
    return response;
  }

  // If authenticated user tries to access auth pages, redirect to dashboard
  if (refreshToken && isPublicRoute(pathname)) {
    const dashboardUrl = new URL(AppConstants.routes.dashboard, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // For all other cases, continue to the requested page
  return NextResponse.next();
}

// Configure which routes middleware will run on
export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 