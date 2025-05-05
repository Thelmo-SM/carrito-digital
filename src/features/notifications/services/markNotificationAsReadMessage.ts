import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

/**
 * Marca una notificación como leída.
 * @param notificationId ID del documento de la notificación
 */
export const markNotificationAsReadMessage = async (notificationId: string) => {
  if (!notificationId) {
    console.error("ID de notificación inválido.");
    return;
  }

  try {
    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
      read: true,
    });

    console.log("Notificación marcada como leída.");
  } catch (error) {
    console.error("Error al marcar la notificación como leída:", error);
  }
};
