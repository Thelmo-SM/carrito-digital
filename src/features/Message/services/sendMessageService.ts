import { getAuth } from "firebase/auth";
import { db } from "@/utils/firebase";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { NotificationMessage } from "@/features/notifications/hooks/useMessageNotification";

/**
 * Envía un mensaje entre dos usuarios.
 * @param text Contenido del mensaje
 * @param receiverId UID del receptor del mensaje (obligatorio)
 */
export const sendMessageService = async (text: string, receiverId: string) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error("El usuario no está autenticado.");
    return;
  }

  const senderId = user.uid;

  if (!receiverId || senderId === receiverId) {
    console.warn("Receptor inválido o intento de enviarse mensaje a sí mismo.");
    return;
  }

  const chatId = [senderId, receiverId].sort().join("_");

  try {
    const chatRef = doc(db, "messages", chatId);

    const chatSnapshot = await getDoc(chatRef);
    if (!chatSnapshot.exists()) {
      await setDoc(chatRef, {
        participants: [senderId, receiverId],
        createdAt: serverTimestamp(),
      });
    }

    const messageRef = collection(db, "messages", chatId, "messages");
    await addDoc(messageRef, {
      senderId,
      text,
      createdAt: serverTimestamp(),
    });

    // 🔔 Agregar notificación SOLO para el receptor
    const notificationRef = collection(db, "notifications");
    await addDoc(notificationRef, {
      userId: receiverId,
      type: "message",
      senderId: senderId,
      message: text,
      chatId,
      createdAt: serverTimestamp(),
      read: false,
    });

    console.log("Mensaje y notificación enviados correctamente.");
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
  }
};


export const getUnreadNotificationsMessage = async (userId: string): Promise<NotificationMessage[]> => {
  try {
    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      where("read", "==", false)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<NotificationMessage, "id">),
    }));
  } catch (error) {
    console.error("Error obteniendo notificaciones no leídas:", error);
    return [];
  }
};





export const markMessagesAsSeenMessage = async (notificationId: string): Promise<void> => {
  const notificationRef = doc(db, "notifications", notificationId);

  // Aquí puedes actualizar la notificación como leída
  await updateDoc(notificationRef, { read: true });
};
