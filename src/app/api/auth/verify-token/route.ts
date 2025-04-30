import { authAdmin } from "@/utils/firebaseAdmin";
import { DecodedIdToken } from "firebase-admin/auth";

interface Body {
  idToken: string;
}

interface CustomClaims extends DecodedIdToken {
  role?: string;
}

export async function POST(req: Request) {
  let body: Body;

  try {
    body = await req.json() as Body;
  } catch (err) {
    console.error('❌ Failed to parse JSON body:', err);
    return new Response(
      JSON.stringify({ success: false, message: 'Invalid JSON body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!body?.idToken) {
    return new Response(
      JSON.stringify({ success: false, message: 'No idToken provided' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { idToken } = body;

    const decodedToken = await authAdmin.verifyIdToken(idToken) as CustomClaims;
    console.log('📥 Decoded Token:', decodedToken);

    const {
      uid,
      name,
      lastName,
      email,
      image,
      createdAt,
      confirmPassword,
      role = 'client',
    } = decodedToken;

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
    console.error('❌ Error verifying token:', error);

    return new Response(
      JSON.stringify({ success: false, message: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

