import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import { collection, onSnapshot, query, orderBy, Timestamp, doc, updateDoc } from "firebase/firestore";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";


type Notification = {
  id?: string;
  title: string;
  uid: string; 
  body: string;
  createdAt: Timestamp;
  read: boolean;
};

export const useNotifications = () => {
  const user = useAuthUsers();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "users", user.uid, "notifications"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notis: Notification[] = [];
      snapshot.forEach((doc) =>
        notis.push({ id: doc.id, ...(doc.data() as Notification) })
      );
      setNotifications(notis);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = async () => {
    if (!user?.uid) return;
    const unread = notifications.filter(n => !n.read);
    for (const noti of unread) {
      const ref = doc(db, "users", user.uid, "notifications", noti.id!);
      await updateDoc(ref, { read: true });
    }
  };

  return {
    notifications,
    unreadCount,
    markAllAsRead
  };
};
