import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getDocument } from '@/utils/firebase';
import { dataUsersTypes } from "@/types/usersTypes";
import { DocumentData } from "firebase/firestore";
import { setInLocalStorage } from "@/store/setInLocalStorage";
import { getInLocalStorage } from "@/store/getInLocalStorage";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";


export const useAuthUsers = () => {

    const [user, setUser] = useState<dataUsersTypes | undefined | DocumentData>(undefined);

    const pathName = usePathname();
    const router = useRouter();

    const protecttedRoutes = ['/dashboard'];
    const isInProtectedRoute = protecttedRoutes.includes(pathName);

    const getUsersDB = async (uid: string) => {
        const path = `users/${uid}`;
        try {
          const data = await getDocument(path); // Asegúrate de que esta función retorne un valor
          setUser(data);
          setInLocalStorage('user', data);
        } catch (error: unknown) {
          console.log('Error al traer usuario:', error);
        }
      };

    
    useEffect(() => {
        return onAuthStateChanged(auth, async (authUser) => {
          if (authUser) {
            const userInLocalStorage = getInLocalStorage('user');
            
            if (userInLocalStorage) {
              setUser(userInLocalStorage);
            } else {
              await getUsersDB(authUser.uid);
            }
          } else {
            if (isInProtectedRoute) {
              router.push('/login');
            }
          }
        });
      }, []);
    return user;
}