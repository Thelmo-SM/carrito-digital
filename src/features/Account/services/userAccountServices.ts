import { UptdateUsersTypes } from "@/types/usersTypes";
import { auth, db } from "@/utils/firebase";
import { updateEmail, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

type SimpleAddress = Omit<UptdateUsersTypes, "createdAt" | "role"> & {
    image: string;
    password?: string;// Hacemos que `password` sea opcional
  };

  export const updateUserProfile = async (uid: string, updatedData: SimpleAddress) => {
    try {
      const userDocRef = doc(db, "users", uid);
      await updateDoc(userDocRef, updatedData);  // Solo actualiza los campos que cambiaron
      console.log("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      throw error;
    }
  };

  export const updateUserEmail = async (newEmail: string) => {
    if (!auth.currentUser) return;
    await updateEmail(auth.currentUser, newEmail);
  };
  
  export const updateUserPassword = async (newPassword: string) => {
    if (!auth.currentUser) return;
    await updatePassword(auth.currentUser, newPassword);
  };
  