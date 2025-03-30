import { auth } from '@/utils/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const loginService = async (user: {email:string, password:string}) => {
    try {
        const userLogin =   await signInWithEmailAndPassword(auth, user.email, user.password);
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