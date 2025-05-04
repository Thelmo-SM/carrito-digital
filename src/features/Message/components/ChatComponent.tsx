"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import ChatButton from "./ChatButton";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import style from '@/styles/ChatComponent.module.css';

interface ChatItem {
  chatId: string;
  participants: string[];
}

interface UserData {
  uid: string;
  name: string;
  lastName: string;
}

export const ChatComponent = () => {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthUsers();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const chatsRef = collection(db, "messages");
        const snapshot = await getDocs(chatsRef);

        const chatsList: ChatItem[] = snapshot.docs
        .map((doc) => ({
          chatId: doc.id,
         participants: doc.data().participants || [],
        }))
       .filter((chat) => chat.participants.includes(user?.uid));

        // Extraer todos los IDs de usuarios que no son el actual
        const otherUserIds = new Set<string>();
        chatsList.forEach((chat) => {
          chat.participants.forEach((id) => {
            if (id !== user?.uid) {
              otherUserIds.add(id);
            }
          });
        });

        // Obtener los datos de los usuarios
        const namesMap: Record<string, string> = {};
        for (const uid of otherUserIds) {
          const userDoc = await getDoc(doc(db, "users", uid));
          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            namesMap[uid] = `${data.name} ${data.lastName}`;
          } else {
            namesMap[uid] = "Usuario desconocido";
          }
        }

        setChats(chatsList);
        setUserNames(namesMap);
        setLoading(false);
      } catch (e) {
        console.error(e);
        setError("Error al cargar los chats.");
        setLoading(false);
      }
    };

    fetchChats();
  }, [user?.uid]);

  if (loading) return <div className={style.loading}>Cargando chats...</div>;
  if (error) return <div className={style.error}>{error}</div>;

  return (
    <div className={style.chatContainer}>
      <h1 className={style.title}>Chats recibidos</h1>
      <ul className={style.chatList}>
        {chats.length === 0 ? (
          <p className={style.emptyMessage}>No hay conversaciones activas.</p>
        ) : (
          chats.map((chat) => {
            const otherUserId = chat.participants.find(id => id !== user?.uid);
            const otherUserName = otherUserId ? userNames[otherUserId] : "Usuario desconocido";

            return (
              <li key={chat.chatId} className={style.chatItem}>
                <Link href={`/messages/${chat.chatId}`} className={style.chatLink}>
                  Conversación con: <span className={style.oterUser}>{otherUserName}</span>
                </Link>
              </li>
            );
          })
        )}
        {chats.length === 0 && (
          <ChatButton senderId={user?.uid} />
        )}
      </ul>
    </div>
  );
};

export default ChatComponent;
