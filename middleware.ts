// middleware.ts

// dependency modules
import { NextRequest, NextResponse } from 'next/server';
// self-defined modules
import { readUserProfile } from '@/app/utils/authApi';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    if (request.nextUrl.pathname.startsWith('/admin') ||
        request.nextUrl.pathname.startsWith('/histori-pemesanan') ||
        request.nextUrl.pathname.startsWith('/isi-pemesanan') ||
        request.nextUrl.pathname.startsWith('/keranjang') ||
        request.nextUrl.pathname.startsWith('/profile') ||
        request.nextUrl.pathname.startsWith('/review') ||
        request.nextUrl.pathname.startsWith('/wishlist')
    ) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  } else {
    try {
      const user = await readUserProfile(token);

      if (request.nextUrl.pathname.startsWith('/admin') && !user.isAdmin) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/signin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/histori-pemesanan/:path*',
    '/isi-pemesanan/:path*',
    '/keranjang/:path*',
    '/profile/:path*',
    '/review/:path*'
  ],
};
