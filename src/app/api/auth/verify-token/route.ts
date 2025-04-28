// app/api/auth/verify-token/route.ts
import { authAdmin, db } from '@/utils/firebaseAdmin'; // Asegúrate de exportar `db` desde firebaseAdmin
import { NextRequest, NextResponse } from 'next/server';

// app/api/auth/verify-token/route.ts
export async function POST(req: NextRequest) {
  const { idToken } = await req.json();

  if (!idToken) {
    return NextResponse.json({ message: 'Token no proporcionado' }, { status: 400 });
  }

  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: 'Usuario no encontrado en Firestore' }, { status: 404 });
    }

    const userData = userDoc.data();
    const role = userData?.role || 'client'; // fallback por si no tiene rol

    const responseData = { success: true, user: userData, role };
    console.log('Response data:', responseData);  // Verificación del contenido de la respuesta
    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('Error al verificar token:', error);
    return NextResponse.json({ message: 'Token inválido o expirado' }, { status: 401 });
  }
}

