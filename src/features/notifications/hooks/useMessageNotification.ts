import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { getAuth } from "firebase/auth";

export const useMessageNotification = () => {
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const userId = user.uid;
    const chatId = `IcCXOSdR31R6XGnAm22R6nS1x0P2_${userId}`.split("_").sort().join("_");
    const messagesRef = collection(db, "messages", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docChanges().filter(
        (change) => change.type === "added" && change.doc.data().senderId !== userId
      );

      if (newMessages.length > 0) {
        setHasNewMessage(true);
      }
    });

    return () => unsubscribe();
  }, [user]);

  return { hasNewMessage, setHasNewMessage };
};
