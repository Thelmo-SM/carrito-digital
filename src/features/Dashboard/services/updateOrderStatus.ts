// services/ordersService.ts
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status: newStatus });
    return true;
  } catch (error) {
    console.error('Error al actualizar el estado del pedido:', error);
    throw error;
  }
};