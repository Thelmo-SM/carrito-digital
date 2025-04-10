'use client';

import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { useEffect, useState } from "react";
import { getProductsUserReviews } from "@/utils/firebase";
import {  ProductOrder1, Review } from "@/types/ordersTypes";
import styles from "@/styles/account.module.css";
import Link from "next/link";
import { LoaderUi } from "@/components/UI/LoaderUi";

export const ReviewsComponent = () => {
  const [productsWithReviews, setProductsWithReviews] = useState<ProductOrder1[]>([]); // Asegúrate de usar el tipo correcto
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthUsers(); // Obtenemos el usuario actual

  useEffect(() => {
    const fetchProductsWithReviews = async () => {
      setLoading(true);
      try {
        if (!user?.uid) return; // Si no hay usuario, no hacer nada

        const productsOrders = await getProductsUserReviews(user.uid);

        // Filtramos solo los productos que tienen reseñas del usuario actual
        const filteredOrders: ProductOrder1[] = productsOrders
          .map(order => ({
            ...order,
            products: order.products
              .map(product => ({
                ...product,
                reviews: product.reviews.filter((review: Review) => review.userId === user?.uid) // Tipamos 'review' aquí como Review
              }))
              .filter(product => product.reviews.length > 0) // Eliminamos productos sin reseñas
          }))
          .filter(order => order.products.length > 0); // Eliminamos órdenes sin productos con reseñas

        setProductsWithReviews(filteredOrders); // Actualizamos el estado con los productos filtrados
      } catch (error) {
        console.error("Error al obtener productos con reseñas:", error);
        setError("Hubo un error al obtener los productos con reseñas.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsWithReviews(); // Llamamos a la función para obtener y filtrar los productos
  }, [user]);

  return (
    <div className={styles.subContainer}>
      <h2 className={styles.title}>Tus reseñas</h2>
      {loading ? (
        <div className={styles.loadingContainer}>
          <LoaderUi />
          <p>{error || "Cargando reseñas..."}</p>
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul className={styles.noDocuments}>
          {productsWithReviews.length === 0 ? <p>No tienes reseñas</p> : 
          productsWithReviews.map((order) => (
            <li key={order.id}>
              <ul className={styles.productList}>
                {order.products.map((product) => (
                  <li key={product.id} className={styles.cardContainer}>
                    <h3>{product.name}</h3>
                    <p>Precio: ${product.price}</p>
                    <div className={styles.reviewContainer}>
                      <h4 className={styles.titleText}>Reseñas:</h4>
                      <ul className={styles.review}>
                        {product.reviews.map((review, index) => (
                          <li key={index}>
                            <p>Calificación: {review.rating}⭐</p>
                            <p>Comentario: {review.comment}</p>
                          </li>
                        ))}
                        <Link href={`/products/${product.id}`} className={styles.vermas}>
                              Ver producto
                        </Link>
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsComponent;
