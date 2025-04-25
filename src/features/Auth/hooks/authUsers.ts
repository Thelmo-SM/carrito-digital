'use client';

import { useEffect, useState } from "react";
import { onAuthStateChanged, getIdToken, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from '@/utils/firebase';
import { dataUsersTypes } from "@/types/usersTypes";
import { DocumentData } from "firebase/firestore";
import { setInLocalStorage } from "@/store/setInLocalStorage";
import { getInLocalStorage } from "@/store/getInLocalStorage";

export const useAuthUsers = () => {
  const [user, setUser] = useState<dataUsersTypes | undefined | DocumentData>(undefined);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    const handleAuthChange = async (authUser: User | null) => {
      if (authUser) {
        const userInLocalStorage = getInLocalStorage('user');

        if (userInLocalStorage) {
          setUser(userInLocalStorage);
        }

        // ✅ Obtener el token y guardarlo como cookie
        const token = await getIdToken(authUser, true);
        document.cookie = `__session=${token}; path=/`;

        // 🔄 Suscribirse a cambios en Firestore
        const userRef = doc(db, "users", authUser.uid);
        unsubscribe = onSnapshot(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const userData = snapshot.data();
            setUser(userData);
            setInLocalStorage('user', userData);
          }
        });
      } else {
        // ❌ Si no hay usuario, limpiar estado y cookie
        setUser(undefined);
        document.cookie = '__session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        if (unsubscribe) unsubscribe();
      }
    };
    

    const unsubscribeAuth = onAuthStateChanged(auth, handleAuthChange);

    return () => {
      if (unsubscribe) unsubscribe();
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (user) {
      console.log("👤 Usuario actualizado:", user);
    }
  }, [user]);

  return user;
};
