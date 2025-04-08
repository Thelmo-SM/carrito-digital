import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenAPI } from '../src/utils/verifyToken'; // Importar la función de verificación de token

const protectedRoutes = ['/dashboard', '/account', '/admin'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Verificar si la ruta está protegida
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    // Obtener el token de las cookies
    const token = req.cookies.get('__session')?.value;

    if (!token) {
      // Si no hay token, redirigir al login
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verificar la validez del token llamando a la API
    const isValid = await verifyTokenAPI(token);
    if (!isValid) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configuración del middleware para las rutas protegidas
export const config = {
  matcher: ['/dashboard/:path*', '/account/:path*', '/admin/:path*'],
};
