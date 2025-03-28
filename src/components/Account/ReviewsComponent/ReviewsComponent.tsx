'use client';

import style from '@/styles/account.module.css';
import ReviewForm from './AddReviews';
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';
import { useCallback, useEffect, useState } from 'react';
import { getCollection, getProductsWithReviews } from '@/utils/firebase';
import { productsTypes } from '@/types/productTypes';


export const ReviewsComponent = () => {
    const [productsWithReviews, setProductsWithReviews] = useState<productTypes[]>([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchProductsWithReviews = async () => {
        try {
          const productIds = await getProductsWithReviews(); // Obtiene los productIds con reseñas
         // const productPromises = productIds.map((id) => getProductDetails(id)); // Obtiene los detalles de cada producto
          const products = await Promise.all(productPromises); // Espera a que se resuelvan todas las promesas
          setProductsWithReviews(products); // Establece el estado con los productos
        } catch (error) {
          console.error("Error al obtener productos con reseñas:", error);
        } finally {
          setLoading(false); // Cambia el estado de carga cuando se complete
        }
      };
  
      fetchProductsWithReviews();
    }, []);
  
    return (
      <div>
        <h2>Productos con Reseñas</h2>
        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <ul>
            {productsWithReviews.map((product) => (
              <li key={product.id}>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>Precio: ${product.price}</p>
                <p>Promedio de reseñas: {product.averageRating}</p>
                {/* Aquí puedes agregar más detalles del producto */}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
};

export default ReviewsComponent;