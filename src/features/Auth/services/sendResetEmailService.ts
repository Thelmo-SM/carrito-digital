import { auth } from "@/utils/firebase";
import { sendPasswordResetEmail } from "firebase/auth";


export const sendResetEmail = (email: string) => {
  return sendPasswordResetEmail(auth, email);
}