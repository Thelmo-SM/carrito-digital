// hooks/useUnreadNotifications.ts
import { useEffect, useState } from "react";
import { db } from "@/utils/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  DocumentData,
  updateDoc,
  doc
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const useUnreadNotificationsMessage = () => {
  const [notifications, setNotifications] = useState<DocumentData[]>([]);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.uid),
      where("read", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(data);
    });

    return () => unsubscribe();
  }, [user]);

  return notifications;
};


/**
 * Marca una notificación como leída
 * @param notificationId ID del documento de la notificación
 */
export const markNotificationAsReadMessage = async (notificationId: string) => {
  const notificationRef = doc(db, "notifications", notificationId);
  await updateDoc(notificationRef, { read: true });
};
