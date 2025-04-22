import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/account', '/admin'];

const verifyTokenAPI = async (token: string, req: NextRequest) => {
  try {
    console.log('Verificando token en API:', token);
    const res = await fetch(`${req.nextUrl.origin}/api/auth/verify-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!res.ok) {
      return false;
    }

    const data = await res.json();
    return data.success;
  } catch (error) {
    console.error('Error al verificar token:', error);
    return false;
  }
};

export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   if (protectedRoutes.some((route) => pathname.startsWith(route))) {
//     const token = req.cookies.get('__session')?.value;
//     console.log('TOKEN en middleware:', token);

//     if (!token) {
//       return NextResponse.redirect(new URL('/login', req.url));
//     }

//     const isValid = await verifyTokenAPI(token, req);

//     if (!isValid) {
//       return NextResponse.redirect(new URL('/login', req.url));
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/account/:path*', '/admin/:path*'],
};
