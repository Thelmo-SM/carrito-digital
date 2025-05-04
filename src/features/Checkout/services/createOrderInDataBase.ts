import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';
import { orderTypes } from '@/types/ordersTypes';

export const createOrderInDatabase = async (orderData: orderTypes) => {
  try {
    const ordersCollection = collection(db, 'orders');
    const createdAt = new Date();

    const orderRef = await addDoc(ordersCollection, {
      sessionId: orderData.sessionId,
      userId: orderData.userId,
      products: orderData.products,
      total: orderData.total,
      shippingAddress: orderData.shippingAddress,
      status: 'Pendiente',
      client: orderData.client,
      orderId: orderData.orderId,
      createdAt,
    });

    return {
      id: orderRef.id,
      sessionId: orderData.sessionId,
      userId: orderData.userId,
      products: orderData.products,
      total: orderData.total,
      shippingAddress: orderData.shippingAddress,
      status: 'Pendiente',
      client: orderData.client,
      orderId: orderData.orderId,
      createdAt,
    };
  } catch (error) {
    console.error("❌ Error al guardar la orden:", error);
    throw new Error('Error al guardar la orden');
  }
};
