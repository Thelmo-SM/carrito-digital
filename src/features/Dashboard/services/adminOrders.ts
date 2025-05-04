import { orderTypes } from "@/types/ordersTypes";
import { db } from "@/utils/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";

export const adminOrders = async (): Promise<orderTypes[]> => {
  const ordersRef = collection(db, "orders");
  const q = query(ordersRef, orderBy("createdAt", "desc"), limit(5));
  const snapshot = await getDocs(q);

  const data: orderTypes[] = [];

  for (const docSnap of snapshot.docs) {
    const orderData = docSnap.data();
    const userId = orderData.userId;

    let displayName = "Usuario desconocido";

    // Buscar el nombre del usuario
    if (userId) {
      const userRef = doc(db, "users", userId);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        displayName = userData.displayName || userData.name || "Sin nombre";
      }
    }

    data.push({
      id: docSnap.id,
      total: Number(orderData.total),
      status: orderData.status,
      createdAt: orderData.createdAt?.toDate?.() || new Date(),
      products: orderData.products || [],
      shippingAddress: orderData.shippingAddress || null,
      client: displayName,
      userId: orderData.userId,
      sessionId: orderData.sessionId,
    });
  }

  return data;
};