// src/app/api/auth/setRole/route.ts

import { authAdmin } from '@/utils/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  const { uid, role } = await req.json();

  if (!uid || !role) {
    return NextResponse.json({ message: 'UID y rol son requeridos' }, { status: 400 });
  }

  try {
    await authAdmin.setCustomUserClaims(uid, { role });
    return NextResponse.json({ message: `Rol '${role}' asignado al usuario ${uid}` }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Error asignando el rol' }, { status: 500 });
  }
}
