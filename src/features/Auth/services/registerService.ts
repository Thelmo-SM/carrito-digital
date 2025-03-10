import { auth } from '@/utils/firebase';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";


export const registerService = async (user: { email: string; password: string }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
    return userCredential.user;
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
