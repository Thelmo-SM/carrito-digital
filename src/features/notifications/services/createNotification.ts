import { db } from "@/utils/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export const createNotification = async (uid: string, title: string, body: string) => {
  const notiRef = collection(db, "users", uid, "notifications");
  await addDoc(notiRef, {
    title,
    body,
    createdAt: serverTimestamp(),
    read: false,
  });
};
