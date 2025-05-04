import { getAuth } from "firebase/auth";
import { db } from "@/utils/firebase";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

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

    console.log("Mensaje enviado correctamente.");
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
  }
};

