import { authAdmin } from "@/utils/firebaseAdmin"; // Asegúrate que esta importación esté bien

export async function POST(req: Request) {
  try {
    // Intentar parsear el body, atrapando errores
    const body = await req.json().catch(() => null);

    if (!body || !body.idToken) {
      return new Response(
        JSON.stringify({ success: false, message: 'No idToken provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { idToken } = body;

    // Verificar el token con Firebase Admin
    const decodedToken = await authAdmin.verifyIdToken(idToken);

    const { uid, name, lastName, email, image, createdAt, role = 'client', confirmPassword } = decodedToken;

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          uid,
          name,
          lastName,
          email,
          image,
          createdAt,
          confirmPassword: confirmPassword ?? '',
          role,
        },
        role,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error verifying token:', error);

    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
