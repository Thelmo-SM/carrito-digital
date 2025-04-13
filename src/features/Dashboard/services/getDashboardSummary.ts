import { db } from '@/utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

export const getDashboardSummary = async () => {
  const productsSnap = await getDocs(collection(db, 'products'));
  const ordersSnap = await getDocs(collection(db, 'orders'));
  const usersSnap = await getDocs(collection(db, 'users'));

  const totalSales = ordersSnap.docs.reduce((acc, doc) => {
    const data = doc.data();
    return acc + (data.total || 0);
  }, 0);

  return {
    productsCount: productsSnap.size,
    ordersCount: ordersSnap.size,
    usersCount: usersSnap.size,
    totalSales,
  };
};
