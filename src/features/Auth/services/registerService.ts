import { auth } from '@/utils/firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";


export const registerService = async (user: { email: string; password: string }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
    return { success: true, user: userCredential.user };
    
  } catch (error) {
    let message = "Ocurrió un error inesperado. Inténtalo más tarde.";
    
    if (error instanceof Error && "code" in error) {
      const registerError = error as { code: string };

      if (registerError.code === "auth/email-already-in-use") {
        message = "El correo ya está registrado. Intenta con otro.";
      }
    }

    return { success: false, message }; // ✅ No retorna 'user' aquí
  }
  };

  export const updateUser = async (user: { displayName?: string | null; photoURL?: string | null }) => {
    if (!auth.currentUser) throw new Error("No hay usuario autenticado");
  
    try {
      await updateProfile(auth.currentUser, user);
      console.log("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      throw error;
    }
  };
