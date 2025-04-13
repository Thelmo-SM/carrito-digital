import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { dataUsersTypes } from '@/types/usersTypes';

export const clientService = async (): Promise<dataUsersTypes[]> => {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
  
    const users = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: data.uid,
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        image: data.image,
        createdAt: data.createdAt,
      } as dataUsersTypes;
    });
  
    return users;
  };