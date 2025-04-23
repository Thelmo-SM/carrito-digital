import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login', '/register'];
const authOnlyRoutes = ['/account'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('__session')?.value;

  // 🔒 Si no hay token y se accede a ruta protegida
  if (!token) {
    if (
      protectedRoutes.some((route) => pathname.startsWith(route)) ||
      authOnlyRoutes.some((route) => pathname.startsWith(route))
    ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  }

  try {
    // 📡 Verificar token con tu API interna
    const res = await fetch(`${req.nextUrl.origin}/api/auth/verify-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) throw new Error('Token inválido');

    const { role, success } = await res.json();

    // ✅ Usuario logueado intentando acceder a login/register
    if (authRoutes.includes(pathname) && success) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // 🚫 Usuario con rol no permitido en dashboard
    if (pathname.startsWith('/dashboard') && role !== 'admin') {
      return NextResponse.redirect(new URL('/account/profile', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('❌ Error verificando token:', error);

    if (
      protectedRoutes.some((route) => pathname.startsWith(route)) ||
      authOnlyRoutes.some((route) => pathname.startsWith(route))
    ) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/account/:path*', '/login', '/register'],
};
