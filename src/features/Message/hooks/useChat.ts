// useChat.tsx
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "@/utils/firebase"; // Asegúrate de importar tu archivo de configuración de Firebase
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

export interface MessageType {
  id: string;
  senderId: string;
  text: string;
  createdAt?: Timestamp;
}

export const useChat = (chatId: string) => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, "messages", chatId, "messages"); // Asegúrate de que la ruta sea correcta
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: MessageType[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          senderId: data.senderId,
          text: data.text,
          createdAt: data.createdAt,
        };
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  return messages;
};
