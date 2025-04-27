// app/api/auth/verify-token/route.ts
import { authAdmin, db } from '@/utils/firebaseAdmin'; // Asegúrate de exportar `db` desde firebaseAdmin
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  let token;
  
  try {
    // Asegúrate de que los datos en el body sean correctos
    const body = await req.json();
    token = body.token;
  } catch (error) {
    console.error('Error al leer el body de la solicitud:', error);
    return NextResponse.json({ message: 'No se pudo procesar la solicitud' }, { status: 400 });
  }

  // Verifica si el token está presente
  if (!token) {
    return NextResponse.json({ message: 'Token no proporcionado' }, { status: 400 });
  }

  try {
    // Verifica y decodifica el token
    const decodedToken = await authAdmin.verifyIdToken(token);
    const uid = decodedToken.uid;

    // Busca el usuario en Firestore
    const userDoc = await db.collection('users').doc(uid).get();

    // Si no se encuentra el usuario, responde con un error
    if (!userDoc.exists) {
      return NextResponse.json({ message: 'Usuario no encontrado en Firestore' }, { status: 404 });
    }

    // Recupera los datos del usuario y su rol
    const userData = userDoc.data();
    const role = userData?.role || 'client'; // Fallback por si no tiene rol

    // Devuelve la respuesta exitosa con los datos del usuario y su rol
    return NextResponse.json({ success: true, user: userData, role }, { status: 200 });

  } catch (error) {
    console.error('Error al verificar el token:', error);
    // Responde con error si el token es inválido o ha expirado
    return NextResponse.json({ message: 'Token inválido o expirado' }, { status: 401 });
  }
}
