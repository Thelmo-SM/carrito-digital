import { Review } from "@/types/ordersTypes";
import { detailProduct } from "@/types/productTypes";
import { db } from "@/utils/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { productsTypes } from "@/types/productTypes";



//Detalle de un producto con reseña 
export async function getProductWithReviews(productId: string): Promise<detailProduct | null> {
  try {
    const productRef = doc(db, `products/${productId}`);
    const productSnap = await getDoc(productRef);

    if (!productSnap.exists()) {
      throw new Error("Producto no encontrado");
    }

    const productData = productSnap.data();

    const reviewsRef = collection(db, `products/${productId}/reviews`);
    const reviewsSnapshot = await getDocs(reviewsRef);

    const reviews: Review[] = reviewsSnapshot.docs.map((reviewDoc) => {
      const reviewData = reviewDoc.data();

      return {
        id: reviewDoc.id,
        userId: reviewData.userId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        createdAt: reviewData.createdAt?.toDate() || new Date(),
      };
    });

    return {
      id: productId,
      name: productData.name,
      description: productData.description,
      price: productData.price,
      soldUnits: productData.soldUnits,
      imageUrl: productData.imageUrl,
      reviews,
    };
  } catch (error) {
    console.error("Error obteniendo el producto con reseñas:", error);
    return null;
  }
}

//Reseñas que pertenecen a cada usuario
export async function getProductsUserReviews(userId: string) {
  const ordersRef = collection(db, "orders");
  const ordersSnapshot = await getDocs(ordersRef);
  
  // Filtrar las órdenes que pertenecen al usuario
  const userOrders = ordersSnapshot.docs.filter(orderDoc => {
    const orderData = orderDoc.data();
    return orderData.userId === userId; // Solo las órdenes del usuario
  });

  // Obtener productos con sus reseñas de las órdenes del usuario
  const orders = await Promise.all(userOrders.map(async (orderDoc) => {
    const orderData = orderDoc.data();
    
    const productsWithReviews = await Promise.all(orderData.products.map(async (product: productsTypes) => {
      // Aquí estamos obteniendo el producto específico desde la colección de productos
      const productRef = doc(db, `products/${product.id}`);
      const productSnap = await getDoc(productRef);

      // Si el producto no existe, lo omitimos
      if (!productSnap.exists()) return null;

      const productData = productSnap.data();
      
      // Obtener las reseñas de ese producto
      const reviewsRef = collection(db, `products/${product.id}/reviews`);
      const reviewsSnapshot = await getDocs(reviewsRef);
      const reviews = reviewsSnapshot.docs.map(reviewDoc => reviewDoc.data());

      // Regresar los productos con sus reseñas
      return {
        id: product.id,
        name: productData?.name,  // Asumiendo que el producto tiene un campo `name`
        description: productData?.description,  // Asumiendo que el producto tiene un campo `description`
        price: productData?.price,  // Asumiendo que el producto tiene un campo `price`
        reviews,  // Reseñas asociadas al producto
      };
    }));

    // Filtrar productos nulos (por si acaso algún producto no existe)
    const validProducts = productsWithReviews.filter((product) => product !== null);

    return {
      id: orderDoc.id,
      total: orderData.total,
      status: orderData.status,
      createdAt: orderData.createdAt.toDate(),
      products: validProducts,  // Solo productos válidos
      shipping: orderData.shipping,
    };
  }));

  return orders;
}