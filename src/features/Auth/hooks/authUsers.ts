'use client';

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from '@/utils/firebase';
import { dataUsersTypes } from "@/types/usersTypes";
import { DocumentData } from "firebase/firestore";
import { setInLocalStorage } from "@/store/setInLocalStorage";
import { getInLocalStorage } from "@/store/getInLocalStorage";
import { usePathname, useRouter } from "next/navigation";

export const useAuthUsers = () => {
    const [user, setUser] = useState<dataUsersTypes | undefined | DocumentData>(undefined);

    const pathName = usePathname();
    const router = useRouter();

    const protecttedRoutes = ['/dashboard'];
    const isInProtectedRoute = protecttedRoutes.includes(pathName);

    useEffect(() => {
        let unsubscribe: (() => void) | null = null;

        const handleAuthChange = (authUser) => {
            if (authUser) {
                const userInLocalStorage = getInLocalStorage('user');
                
                if (userInLocalStorage) {
                    setUser(userInLocalStorage);
                }

                // Suscribirse a cambios en Firestore en tiempo real
                const userRef = doc(db, "users", authUser.uid);
                unsubscribe = onSnapshot(userRef, (snapshot) => {
                    if (snapshot.exists()) {
                        const userData = snapshot.data();
                        setUser(userData);
                        setInLocalStorage('user', userData);
                    }
                });
            } else {
                if (isInProtectedRoute) {
                    router.push('/login');
                }
                setUser(undefined);
                if (unsubscribe) unsubscribe(); // Detener la suscripción si el usuario cierra sesión
            }
        };

        const unsubscribeAuth = onAuthStateChanged(auth, handleAuthChange);

        return () => {
            if (unsubscribe) unsubscribe();
            unsubscribeAuth();
        };
    }, []);

    return user;
};
