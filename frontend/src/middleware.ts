import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is protected (admin routes)
  const isAdminPath = pathname.startsWith('/admin');

  // Check if the path is for resume download
  const isResumeDownload = pathname.startsWith('/api/resume/download');

  // Get the token from cookies
  const token = request.cookies.get('authToken')?.value;

  // If it's an admin path and no token exists, redirect to login
  if (isAdminPath && !token) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }

  // If it's a resume download and no token exists, prevent access
  if (isResumeDownload && !token) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Authentication required' }),
      {
        status: 401,
        headers: { 'content-type': 'application/json' },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/resume/download/:path*'],
};
