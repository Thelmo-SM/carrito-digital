import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/utils/firebase";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";

interface ChatNotificationContextType {
  hasNewMessage: boolean;
  markMessagesAsSeen: () => Promise<void>;
  lastSeenMessage: number | null;
}

const ChatNotificationContext = createContext<ChatNotificationContextType>({
  hasNewMessage: false,
  markMessagesAsSeen: async () => {},
  lastSeenMessage: null,
});

export const ChatNotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = useAuthUsers();
  const userId = user?.uid;

  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [lastSeenMessage, setLastSeenMessage] = useState<number | null>(null);

  // Escucha los datos del usuario (incluyendo lastSeenMessage)
  useEffect(() => {
    if (!userId) return;

    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      const data = snapshot.data();
      if (data?.lastSeenMessage) {
        setLastSeenMessage(data.lastSeenMessage);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    if (!userId || lastSeenMessage === null) return;
  
    const chatsRef = collection(db, "messages");
  
    const unsubscribeChats = onSnapshot(chatsRef, (snapshot) => {
      const unsubscribes: (() => void)[] = [];
  
      snapshot.forEach((chatDoc) => {
        const chatId = chatDoc.id;
        const [id1, id2] = chatId.split("_");
  
        // Ignorar chats donde no participa el usuario
        if (id1 !== userId && id2 !== userId) return;
  
        // Ignorar chats consigo mismo
        if (id1 === id2 && id1 === userId) return;
  
        // Ahora escuchamos los mensajes de ese chat
        const messagesRef = collection(db, "messages", chatId, "messages");
        const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));
  
        const unsubscribeMsg = onSnapshot(q, (msgSnapshot) => {
          const doc = msgSnapshot.docs[0];
          if (!doc) return;
  
          const data = doc.data();
          const createdAt = data.createdAt?.toDate().getTime();
          const senderId = data.senderId;
  
          // Si el mensaje es de otro usuario y es más reciente que lastSeenMessage, notificar
          if (
            createdAt &&
            createdAt > lastSeenMessage &&
            senderId !== userId
          ) {
            setHasNewMessage(true);
          }
        });
  
        unsubscribes.push(unsubscribeMsg);
      });
  
      // Limpiar listeners de mensajes
      return () => unsubscribes.forEach((unsub) => unsub());
    });
  
    return () => unsubscribeChats();
  }, [userId, lastSeenMessage]);

  // Marcar mensajes como vistos
  const markMessagesAsSeen = async () => {
    if (!userId) return;

    const now = Date.now();
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      lastSeenMessage: now,
    });

    setLastSeenMessage(now);
    setHasNewMessage(false);
  };

  return (
    <ChatNotificationContext.Provider
      value={{ hasNewMessage, markMessagesAsSeen, lastSeenMessage }}
    >
      {children}
    </ChatNotificationContext.Provider>
  );
};

export const useChatNotificationContext = () => useContext(ChatNotificationContext);