import { Review } from "@/types/ordersTypes";
import { productsTypes } from "@/types/productTypes";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";


export async function getTopRatedProducts(): Promise<productsTypes[]> {
  const productsRef = collection(db, "products");
  const productsSnapshot = await getDocs(productsRef);

  const products = await Promise.all(
    productsSnapshot.docs.map(async (docSnap) => {
      const productData = docSnap.data();

      // Extraer los datos del producto con valores por defecto
      const {
        name = "",
        price = 0,
        soldUnits = 0,
        categorie = [],
        description = "",
        imageUrl = "",
      } = productData;

      // Obtener las reviews
      const reviewsRef = collection(db, `products/${docSnap.id}/reviews`);
      const reviewsSnapshot = await getDocs(reviewsRef);
      
      const reviews: Review[] = reviewsSnapshot.docs.map((reviewDoc) => {
        const reviewData = reviewDoc.data();

        return {
          id: reviewDoc.id,
          userId: reviewData.userId ?? "",
          rating: Number(reviewData.rating) || 0,
          comment: reviewData.comment ?? "",
          createdAt: reviewData.createdAt?.toDate?.() || null,
        };
      });

      // Calcular la puntuación promedio de las reseñas
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
          : 0;

      // Retornar el producto con las reviews correctamente tipadas
      return {
        id: docSnap.id,
        name,
        price,
        soldUnits,
        categorie,
        description,
        imageUrl,
        reviews,
        avgRating,
      };
    })
  );

  // Ordenar los productos por rating promedio, de mayor a menor
  return products.sort((a, b) => b.avgRating - a.avgRating);
}