import { db } from '@/utils/firebase';
import { orderTypes } from '@/types/ordersTypes';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';

export const getOrderBySessionId = async (sessionId: string): Promise<orderTypes | null> => {
  try {
    // Referencia a la colección de 'orders'
    const ordersRef = collection(db, 'orders');

    // Consultamos la colección para encontrar el documento con el sessionId
    const q = query(ordersRef, where('sessionId', '==', sessionId), limit(1));
    const querySnapshot = await getDocs(q);

  

    // Si no hay resultados, logueamos el error y retornamos null
    if (querySnapshot.empty) {
      // console.log('No se encontró una orden con el sessionId:', sessionId);
      return null;
    }

    // Si encontramos resultados, obtenemos el primer documento
    const doc = querySnapshot.docs[0];
    // console.log('Orden encontrada:', doc.data());

    // Extraemos los datos del documento
    const data = doc.data();

    // Retornamos el objeto `orderTypes` con los datos extraídos
    // console.log('Buscando orden con sessionId:', sessionId);
    return {
      id: doc.id,  // ID del documento
      total: data.total,  // Total de la orden
      status: data.status,  // Estado de la orden
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),  // Fecha de creación
      products: data.products,  // Lista de productos
      shippingAddress: data.shippingAddress || null,  // Dirección de envío (si existe)
      client: data.client,  // Cliente asociado
      orderId: data.orderId,  // ID de la orden
      sessionId: data.sessionId,  // sessionId (confirmación de que está en el documento)
      userId: data.userId,  // ID de usuario
    } as orderTypes;

  
  } catch (error) {
    // Si hay algún error, lo mostramos en consola y retornamos null
    console.error('Error buscando la orden por sessionId:', error);
    return null;
  }
};
