import { db } from '@/utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { OrderDetailComponentProps } from '@/types/ordersTypes';

export const getOrderDetail = async (sessionId: string): Promise<OrderDetailComponentProps | null> => {
    console.log('Buscando orden con sessionId:', sessionId);
  
    const q = query(collection(db, 'orders'), where('sessionId', '==', sessionId));
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0];
      const orderData = docData.data();
  
      console.log('Orden encontrada:', orderData);
  
      return {
        id: docData.id,
        total: orderData.total || 0,
        status: orderData.status || 'pending',
        createdAt: orderData.createdAt ? orderData.createdAt.toDate() : new Date(),
        products: orderData.products || [],
        shippingAddress: orderData.shippingAddress || null,
        client: orderData.client || null,
        orderId: orderData.orderId || '',
        sessionId: orderData.sessionId || '',
        userId: orderData.userId || ''
      } as OrderDetailComponentProps;
    } else {
      // 👇 Agrega esto para debug
      const allDocs = await getDocs(collection(db, 'orders'));
      allDocs.forEach(doc => {
        console.log('Orden en base de datos:', doc.data().sessionId);
      });
  
      console.log('Orden no encontrada con sessionId:', sessionId);
      return null;
    }
  };
  