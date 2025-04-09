import { NextRequest, NextResponse } from 'next/server';
import { authAdmin } from '@/utils/firebaseAdmin'; // Asegúrate de que la ruta sea correcta

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ message: 'Token no proporcionado' }, { status: 400 });
  }

  try {
    // Verificar el token usando Firebase Admin SDK
    const decodedToken = await authAdmin.verifyIdToken(token);

    // Si todo es correcto, responder con éxito
    return NextResponse.json({ success: true, user: decodedToken }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Token inválido o expirado' }, { status: 401 });
  }
}
