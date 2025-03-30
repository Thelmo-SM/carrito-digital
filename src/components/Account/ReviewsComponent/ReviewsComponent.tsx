'use client';

import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { useEffect, useState } from "react";
import { getProductsUserReviews } from "@/utils/firebase";
import { ProductOrder } from "@/types/ordersTypes";
import styles from "@/styles/account.module.css";
import Link from "next/link";

export const ReviewsComponent = () => {
  const [productsWithReviews, setProductsWithReviews] = useState<ProductOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthUsers(); // Obtenemos el usuario actual

  useEffect(() => {
    const fetchProductsWithReviews = async () => {
      try {
        const productsOrders = await getProductsUserReviews(user?.uid); // Llamamos a la función con el userId

        // Filtramos solo los productos que tienen reseñas
        const filteredOrders = productsOrders.map(order => ({
          ...order,
          products: order.products.filter(product => product.reviews.length > 0), // Filtramos productos con reseñas
        })).filter(order => order.products.length > 0); // Filtramos órdenes sin productos con reseñas

        console.log("Órdenes con productos y reseñas:", filteredOrders);
        setProductsWithReviews(filteredOrders); // Actualizamos el estado con los productos filtrados
      } catch (error) {
        console.error("Error al obtener productos con reseñas:", error);
        setError("Hubo un error al obtener los productos con reseñas.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      fetchProductsWithReviews();
    }
  }, [user]);

  return (
    <div className={styles.subContainer}>
      <h2 className={styles.title}>Tus reseñas</h2>
      {loading ? (
        <p>{error || "Cargando productos..."}</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul className={styles.noDocuments}>
          {productsWithReviews.length === 0 ? <p>No tienes reseñas</p> : 
          productsWithReviews.map((order) => (
            <li key={order.id} >
              {/* <p>Estado: {order.status}</p>
              <p>Total: {order.total}</p> */}
              <ul className={styles.productList}>
                {order.products.map((product) => (
                  <li key={product.id} className={styles.cardContainer}>
                    <h3>{product.name}</h3>
                    {/* <p>{product.description}</p> */}
                    <p>Precio: ${product.price}</p>
                    <div className={styles.reviewContainer}>
                      <h4 className={styles.titleText}>Reseñas:</h4>
                    <ul className={styles.review}>
                      {product.reviews.map((review, index) => (
                        <li key={index} >
                          <p>Calificación: {review.rating}⭐</p>
                          <p>Comentario: {review.comment}</p>
                          <Link href={`/products/${product.id}`} 
                          className={styles.vermas}
                          >Ver producto</Link>
                        </li>
                      ))}
                    </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))
          }
        </ul>
      )}
    </div>
  );
};

export default ReviewsComponent;