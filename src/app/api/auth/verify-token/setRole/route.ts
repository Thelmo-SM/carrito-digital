//app/api/auth/setRole/route.ts
import { authAdmin } from '@/utils/firebaseAdmin';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uid, role } = req.body;

  if (!uid || !role) {
    return res.status(400).json({ message: 'UID y rol son requeridos' });
  }

  try {
    await authAdmin.setCustomUserClaims(uid, { role }); // 👈 Aquí defines el rol
    res.status(200).json({ message: `Rol '${role}' asignado al usuario ${uid}` });
  } catch (error) {
    res.status(500).json({ error: 'Error asignando el rol' });
    return error;
  }
}
