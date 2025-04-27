import { Review } from "@/types/ordersTypes";
import { db } from "@/utils/firebase";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";






//Nombre del usuario que realizo la reseña 
export const getUserName = async (userId: string) => {
  try {
    const userRef = doc(db, `users/${userId}`);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().name; // Suponiendo que el campo 'name' existe
    } else {
      return "Usuario desconocido"; // En caso de que no se encuentre el usuario
    }
  } catch (error) {
    console.error("Error obteniendo el nombre del usuario:", error);
    return "Usuario desconocido";
  }
};

// Función para agregar una reseña a un producto
export const addReviewToProduct = async (productId: string, reviewData: Omit<Review, 'id'>) => {
  try {
    // Referencia a la colección de reseñas dentro del producto específico
    const reviewsCollectionRef = collection(db, "products", productId, "reviews");
    
    // Agregar la reseña a Firestore
    await addDoc(reviewsCollectionRef, reviewData);

    console.log("Reseña agregada correctamente al producto:", productId);
  } catch (error) {
    console.error("Error al agregar reseña al producto:", error);
    throw new Error("No se pudo agregar la reseña.");
  }
};