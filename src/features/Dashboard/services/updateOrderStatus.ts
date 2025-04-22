// services/ordersService.ts
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status: status, // Actualiza el estado de la orden
    });
    console.log("✅ Estado de la orden actualizado:", status);
  } catch (error) {
    console.error("❌ Error al actualizar el estado de la orden:", error);
    throw new Error('Error al actualizar el estado de la orden');
  }
};