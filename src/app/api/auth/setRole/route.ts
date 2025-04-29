import { authAdmin } from '@/utils/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // Intentamos parsear el cuerpo de la solicitud
  const body = await req.json().catch(() => null);

  // Si no hay body o falta uid o role, respondemos con un error
  if (!body || !body.uid || !body.role) {
    return NextResponse.json(
      { message: 'UID y rol son requeridos' },
      { status: 400 }
    );
  }

  try {
    // Asignamos el rol al usuario
    await authAdmin.setCustomUserClaims(body.uid, { role: body.role });
    return NextResponse.json(
      { message: `Rol '${body.role}' asignado al usuario ${body.uid}` },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Error asignando el rol' },
      { status: 500 }
    );
  }
}
