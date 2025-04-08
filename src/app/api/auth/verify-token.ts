import { NextApiRequest, NextApiResponse } from 'next';
import { authAdmin } from '@/utils/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: 'Token no proporcionado' });
    }

    try {
      // Verificar el token utilizando Firebase Admin SDK
      const decodedToken = await authAdmin.verifyIdToken(token);
      return res.status(200).json({ success: true, user: decodedToken });
    } catch (error: unknown) {
    console.log(error)
      return res.status(401).json({ message: 'Token inválido o expirado' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
