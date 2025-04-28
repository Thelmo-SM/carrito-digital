// app/api/auth/verify-token/route.ts
import { authAdmin } from '@/utils/firebaseAdmin'; // Asegúrate de exportar `db` desde firebaseAdmin
// import { NextRequest, NextResponse } from 'next/server';

// app/api/auth/verify-token/route.ts
export async function POST(req: Request) {
  try {
    // Primero intenta parsear el body
    const body = await req.json().catch(() => null); // Si falla, body será null
    if (!body || !body.idToken) {
      return new Response(
        JSON.stringify({ success: false, message: 'No idToken provided' }),
        { status: 400 }
      );
    }

    const { idToken } = body;

    // Verificamos el token con Firebase Admin
    const decodedToken = await authAdmin.verifyIdToken(idToken);

    const role = decodedToken.role || 'client'; // Ajusta si tienes otro campo

    // Opcionalmente puedes devolver más cosas
    return new Response(
      JSON.stringify({ success: true, user: decodedToken, role }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/auth/verify-token:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
