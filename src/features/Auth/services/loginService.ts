import { auth } from '@/utils/firebase';
import { getIdToken, signInWithEmailAndPassword, User  } from 'firebase/auth';
import Cookies from "js-cookie";

const setTokenInCookie = async (user: User ) => {
  const token = await getIdToken(user, true);
  Cookies.set('__session', token, {
    secure: true,
    sameSite: 'strict',
    path: '/',
  });
};

export const loginService = async (user: {email:string, password:string}) => {
    try {
        const userLogin =   await signInWithEmailAndPassword(auth, user.email, user.password);
        await setTokenInCookie(userLogin.user);
        return { success: true, user: userLogin };
    } catch (error: unknown) {
        if (error instanceof Error && "code" in error) {
            const firebaseError = error as { code: string };
      
            if (firebaseError.code === "auth/invalid-credential") {
              return { success: false, message: "Credenciales incorrectas. Verifica tus datos." };
            }
          }
      
          return { success: false, message: "Ocurrió un error inesperado. Inténtalo más tarde." };
        }
    };