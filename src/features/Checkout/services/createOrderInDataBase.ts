// /utils/firebase.ts
import { collection, addDoc } from 'firebase/firestore';
import { OrderTypes1 } from '@/types/ordersTypes';
import { db } from '@/utils/firebase';  // Importa la instancia de Firestore

export const createOrderInDatabase = async (orderData) => {
    try {
        // Obtener la referencia a la colección 'orders'
        const ordersCollection = collection(db, 'orders');

        // Agregar el pedido a Firestore
        const orderRef = await addDoc(ordersCollection, {
            sessionId: orderData.sessionId,
            userId: orderData.userId,
            products: orderData.products,
            total: orderData.total,
            shippingAddress: orderData.shippingAddress,
            status: 'pending', // O el estado que consideres apropiado
            createdAt: new Date(),
        });

        // Retornar el ID del documento creado
        return orderRef.id;
    } catch (error) {
        console.error('Error al guardar el pedido en la base de datos:', error);
        throw new Error('Error al guardar el pedido');
    }
};
