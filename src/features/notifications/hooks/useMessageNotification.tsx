import { createContext, useContext, useState, useEffect } from "react";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { Timestamp } from "firebase/firestore";
import { getUnreadNotificationsMessage, markMessagesAsSeenMessage } from "@/features/Message/services/sendMessageService";

// Tipo de Notificación
export interface NotificationMessage {
  id: string;
  userId: string;
  senderId: string;
  message: string;
  chatId: string;
  createdAt: Timestamp;
  read: boolean;
  type: string;
}

// Tipo del Contexto
interface ChatNotificationContextType {
  hasNewNotification: boolean;
  markNotificationsAsSeen: () => void;
}

const ChatNotificationContext = createContext<ChatNotificationContextType>({
  hasNewNotification: false,
  markNotificationsAsSeen: () => {},
});

export const ChatNotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthUsers();
  const userId = user?.uid;
  const [hasNewNotification, setHasNewNotification] = useState(false);

  // Verificar notificaciones no leídas
  useEffect(() => {
    if (!userId) return;
  
    console.log("userId actual:", userId); // <-- ¿Coincide con el del documento?
  
    const checkNotifications = async () => {
      const notifications = await getUnreadNotificationsMessage(userId);
      console.log("Notificaciones no leídas:", notifications);
      setHasNewNotification(notifications.length > 0);
    };
  
    checkNotifications();
  }, [userId]);

  // Función para marcar las notificaciones como leídas
  const markNotificationsAsSeen = () => {
    if (!userId) return;

    // Obtener notificaciones no leídas y marcarlas como leídas
    getUnreadNotificationsMessage(userId).then((notifications: NotificationMessage[]) => {
      notifications.forEach((notification) => {
        markMessagesAsSeenMessage(notification.id);
      });
    });

    setHasNewNotification(false);
  };

  return (
    <ChatNotificationContext.Provider value={{ hasNewNotification, markNotificationsAsSeen }}>
      {children}
    </ChatNotificationContext.Provider>
  );
};

export const useChatNotificationContext = () => useContext(ChatNotificationContext);
