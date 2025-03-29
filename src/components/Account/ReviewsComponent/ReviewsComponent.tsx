'use client';

import style from '@/styles/account.module.css';
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';
import { useEffect, useState } from 'react';
import { getProductsWithReviews } from '@/utils/firebase';
import { ProductOrder } from '@/types/ordersTypes';

export const ReviewsComponent = () => {
  const [productsWithReviews, setProductsWithReviews] = useState<ProductOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const user = useAuthUsers();

  useEffect(() => {


    const fetchProductsWithReviews = async () => {

      try {
        // Aquí puedes obtener solo los productos que el usuario ha comprado
        const productsOrders = await getProductsWithReviews();
        console.log('Órdenes con productos y reseñas:', productsOrders);
        setProductsWithReviews(productsOrders);
      } catch (error) {
        console.error("Error al obtener productos con reseñas:", error);
        setError("Hubo un error al obtener los productos con reseñas.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductsWithReviews();
  }, [user]);

  return (
    <div className={style.subContainer}>
      <h2>Productos con Reseñas</h2>
      {loading ? (
        <p>{error || 'Cargando productos...'}</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {productsWithReviews.map((product) => (
            <li key={product.id}>
              <h3>{product.name}</h3> {/* Nombre del producto */}
              <p>{product.description}</p> {/* Descripción del producto */}
              <p><strong>Precio:</strong> ${product.price}</p> {/* Precio del producto */}

              {/* Mostrar las reseñas de este producto */}
              <div>
                <h4>Reseñas:</h4>
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review, index) => (
                    <div key={index} className="review">
                      <p><strong>{review.userId}</strong></p>
                      <p>Calificación: {review.rating} ⭐</p>
                      <p>{review.comment}</p>
                    </div>
                  ))
                ) : (
                  <p>No hay reseñas para este producto.</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReviewsComponent;
