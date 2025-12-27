import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AppConstants } from './lib/utils/app-constants'

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')
  const { pathname } = request.nextUrl

  // Define auth routes that should be inaccessible to logged-in users
  const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password', '/verify-otp']
  
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  if (isAuthRoute && refreshToken) {
    // Redirect to home/dashboard if user is already logged in
    return NextResponse.redirect(new URL(AppConstants.routes.home || '/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
  ],
}
