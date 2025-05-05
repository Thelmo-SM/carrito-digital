"use client";

import { useChat } from "../hooks/useChat";
import { useState, useEffect, useRef } from "react";
import { sendMessageService } from "../services/sendMessageService";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import styles from "@/styles/ChatComponent.module.css";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";

const ChatComponentId = ({ chatId }: { chatId: string }) => {
  const messages = useChat(chatId);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const user = useAuthUsers();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!chatId) return; 
  
    const fetchUserNamesAndImages = async () => {
      const participants = [chatId.split("_")[0], chatId.split("_")[1]];
  
      const newNames: Record<string, string> = {};
      const newImages: Record<string, string> = {};
  
  
      for (const uid of participants) {
        if (!newNames[uid]) {
          try {
            const docSnap = await getDoc(doc(db, "users", uid));
            if (docSnap.exists()) {
              newNames[uid] = docSnap.data().name || "Usuario";
              newImages[uid] = docSnap.data().image || "/default-avatar.png";
            } else {
              newNames[uid] = "Desconocido";
              newImages[uid] = "/default-avatar.png";
              console.log(`Usuario no encontrado: ${uid}`);
            }
          } catch (err: unknown) {
            newNames[uid] = "Error";
            newImages[uid] = "/default-avatar.png";
            console.log("Error al obtener datos del usuario:", err);
          }
        }
      }
  
      setUserNames((prev) => ({ ...prev, ...newNames }));
    };
  
    if (messages.length > 0) fetchUserNamesAndImages(); 
  
  }, [messages, chatId]);

  const adminId = user?.uid;

  if (!adminId) {
    return <div>Debes iniciar sesión para enviar mensajes.</div>;
  }

  const handleSend = async () => {
    if (!chatId.includes("_") || text.trim() === "") return;
  
    const [uid1, uid2] = chatId.split("_");
    const receiverId = uid1 === adminId ? uid2 : uid1;
  
    try {
      setIsLoading(true);
  
      await sendMessageService(text.trim(), receiverId);;
  
      setText("");
      setIsLoading(false);
      setError(null);
    } catch (error: unknown) {
      setIsLoading(false);
      setError("Hubo un problema al enviar el mensaje. Intenta de nuevo.");
      console.log(error);
    }
  };

  return (
    <div className={styles.chatContainer}>
      {/* <h2 className={styles.chatTitle}>
        Estás conversando con{" "}
        <span className={styles.oterUser}>{userNames[chatId.split("_")[1]]}</span>
      </h2> */}

      <div ref={chatContainerRef} className={styles.chatBox}>
      {
        messages.map((message) => {
        const userName = userNames[message.senderId] || "Desconocido";

           return (
             <div
             className={message.senderId === 'IcCXOSdR31R6XGnAm22R6nS1x0P2' ? 
               styles.adminMessage : styles.clientMessage
              } 
              key={message.id}>
                <span>{userName}</span>
                <p>{message.text}</p>
                <p className={styles.date}>    {message.createdAt 
                   ? new Date(message.createdAt.seconds * 1000).toLocaleString() 
                   : 'Fecha no disponible'}
                </p>
             </div>
                  );
          })
        }
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.inputContainer}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={styles.input}
          placeholder="Escribe tu mensaje..."
        />
        <button
          onClick={handleSend}
          disabled={text.trim() === ""}
          className={styles.sendButton}
        >
          {isLoading ? "Enviando..." : "Enviar"}
        </button>
      </div>
    </div>
  );
};

export default ChatComponentId;