import { db } from "@/utils/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

export const getUserOrders = async (userId: string) => {
  try {
    const userOrdersSnapshot = await getDocs(
      query(collection(db, "orders"), where("userId", "==", userId))
    );

    const userOrders = await Promise.all(
      userOrdersSnapshot.docs.map(async (docSnapshot) => { // Cambié `doc` a `docSnapshot` para mayor claridad
        const orderData = docSnapshot.data();
        
        const productDetails = await Promise.all(
          orderData.products.map(async (product: { id: string }) => {
            const productDoc = await getDoc(doc(db, "products", product.id));
            if (productDoc.exists()) {
              const productData = productDoc.data();
              return {
                ...productData, // Asegúrate de incluir todos los datos del producto, incluidas las imágenes
                id: product.id
              };
            }
            return null;
          })
        );
    
        return {
          id: docSnapshot.id,
          total: orderData.total,
          status: orderData.status,
          createdAt: orderData.createdAt ? orderData.createdAt.toDate() : null,
          products: productDetails.filter((product) => product !== null),
          shippingAddress: orderData.shippingAddress || {},
          sessionId: orderData.sessionId
        };
      })
    );

    return userOrders;
  } catch (error) {
    console.error("Error al obtener las órdenes del usuario:", error);
    throw new Error("No se pudieron obtener las órdenes");
  }
};
