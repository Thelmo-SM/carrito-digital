// app/api/auth/verify-token/route.ts
import { authAdmin, db } from '@/utils/firebaseAdmin'; // Asegúrate de exportar `db` desde firebaseAdmin
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { token } = await req.json();

  if (!token) {
    return NextResponse.json({ message: 'Token no proporcionado' }, { status: 400 });
  }

  try {
    // Decodifica el token
    const decodedToken = await authAdmin.verifyIdToken(token);
    const uid = decodedToken.uid;

    // 🔍 Busca el usuario en Firestore
    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return NextResponse.json({ message: 'Usuario no encontrado en Firestore' }, { status: 404 });
    }

    const userData = userDoc.data();
    const role = userData?.role || 'client'; // fallback por si no tiene rol

    return NextResponse.json({ success: true, user: userData, role }, { status: 200 });

  } catch (error) {
    console.error('Error al verificar token:', error);
    return NextResponse.json({ message: 'Token inválido o expirado' }, { status: 401 });
  }
}
