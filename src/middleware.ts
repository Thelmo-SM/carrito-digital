// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// const protectedRoutes = ['/dashboard'];
// const authRoutes = ['/login', '/register'];
// const authOnlyRoutes = ['/account'];
// const cartRoute = ['/cart'];

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;
//   const idToken = req.cookies.get('__session')?.value;

//   const requiresAuth = [
//     ...protectedRoutes,
//     ...authOnlyRoutes,
//     ...cartRoute
//   ];

//   // 🔒 Si no hay token y se intenta acceder a rutas que requieren autenticación
//   if (!idToken) {
//     if (requiresAuth.some((route) => pathname.startsWith(route))) {
//       const redirectTo = pathname.startsWith('/cart') ? '/' : '/login';
//       return NextResponse.redirect(new URL(redirectTo, req.url));
//     }
//     return NextResponse.next();
//   }
//   console.log('Este es el token: ', idToken);

//   try {
//     const res = await fetch(`${req.nextUrl.origin}/api/auth/verify-token`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ idToken: idToken }), // Aquí envías el token
//     });
  
//     if (!res.ok) throw new Error('Token inválido');
  
//     const data = await res.json();  // Aquí obtenemos la respuesta JSON

//     // Verifica si la respuesta es válida antes de usarla
//     if (!data || !data.success) {
//       throw new Error('Respuesta inesperada del servidor');
//     }

//     const { role, success } = data;  // Usamos los datos directamente de la variable `data`

//     // ✅ Usuario logueado intentando acceder a login/register
//     if (authRoutes.includes(pathname) && success) {
//       return NextResponse.redirect(new URL('/', req.url));
//     }

//     // 🚫 Usuario con rol no permitido en dashboard
//     if (pathname.startsWith('/dashboard') && role !== 'admin') {
//       return NextResponse.redirect(new URL('/account/profile', req.url));
//     }

//     return NextResponse.next();
//   } catch (error) {
//     console.error('❌ Error verificando token:', error);

//     if (
//       protectedRoutes.some((route) => pathname.startsWith(route)) ||
//       authOnlyRoutes.some((route) => pathname.startsWith(route))
//     ) {
//       return NextResponse.redirect(new URL('/login', req.url));
//     }

//     if (pathname.startsWith('/cart')) {
//       // Si falla en el carrito, redirigir a la página principal
//       return NextResponse.redirect(new URL('/', req.url));
//     }

//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: ['/dashboard/:path*', '/account/:path*', '/login', '/register', '/cart'],
// };
