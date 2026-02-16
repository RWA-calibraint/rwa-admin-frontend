import { NextRequest, NextResponse } from 'next/server';

import { PATH_LIST } from './helpers/constants/authentication-paths';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.has('token');
  const [, pathname] = request.nextUrl.pathname.split('/');

  if (request.nextUrl.pathname.endsWith('.svg')) {
    // Allow SVG files to pass through
    return NextResponse.next();
  }

  if (isAuthenticated && PATH_LIST.has(pathname)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isAuthenticated && !PATH_LIST.has(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!health-check|_next/static|_next/image|favicon.ico|login_header|login_banner).*)'],
};
