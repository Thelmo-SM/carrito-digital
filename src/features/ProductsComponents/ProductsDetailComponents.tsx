'use client';

import { formatPrice } from "@/features/Dashboard/helpers/formatPrice";
import Style from '@/styles/products.module.css';
import Image from "next/image";
import { detailProduct } from "@/types/productTypes";
import { useCart } from "@/store/ProductCartContext";
import { cartTypes } from "@/types/productTypes";
import { useAuthUsers } from "@/features/Auth/hooks/authUsers";
import { getUserName } from "@/utils/firebase";
import { useEffect, useState } from "react";


export const ProductDetailComponent = ({
    id,
    name,
    price,
    soldUnits,
    description,
    imageUrl,
    reviews, // Recepción de reseñas
  }: detailProduct) => {
    const { cart, setCart } = useCart();
    const user = useAuthUsers();
    const [userNames, setUserNames] = useState<string[]>([]);
  
    const newCart: cartTypes = {
      name,
      soldUnits,
      price,
      imageUrl,
      id: id.toString(),
    };
  
    const handleAddToCard = (product: cartTypes) => {
      if (user?.uid) {
        const updatedCart = [...cart, { ...product, userId: user?.uid }];
        setCart(updatedCart);  // ✅ Actualiza el estado
        console.log('Producto agregado:', updatedCart);
      } else {
        console.log('Usuario no autenticado');
      }
    };

    useEffect(() => {
        const fetchUserNames = async () => {
          const names: string[] = [];
          for (const review of reviews) {
            const userName = await getUserName(review.userId);
            names.push(userName);
          }
          setUserNames(names);
        };
    
        fetchUserNames();
      }, [reviews]);

    
  
  
    return (
      <div className={Style.dContainer}>
        <div className={Style.details}>
          <div className={Style.subDcontainer1}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                width={600}
                height={600}
                alt={name}
                className={Style.img2}
              />
            ) : (
              <p>No hay imagen disponible</p>
            )}
            <p className={Style.pPuntaje}> Reseñas
              <span className={Style.rating}> ★ {reviews.length}</span>
            </p>
          </div>
  
          <div className={Style.subDcontainer2}>
            <p className={Style.title}>{name}</p>
            <p className={Style.description}>{description}</p>
            <p className={Style.quedan}>
              Quedan <span className={Style.span}>{soldUnits}</span> disponibles
            </p>
            <p className={Style.precio}>
              Precio <span className={Style.price}>{formatPrice(Number(price))}</span>
            </p>
            <div className={Style.compra}>
              <p>Agregar cantidad + 1</p>
              <button onClick={() => handleAddToCard(newCart)}>
                AÑADIR AL CARRITO
              </button>
            </div>
            
          </div>
        </div>
  
        <div className={Style.reviewsContainer}>
        <h3>Reseñas</h3>
        {reviews.length > 0 ? (
          <div className={Style.reviews}>
            {reviews.map((review, index) => (
              <div key={review.userId} className={Style.review}>
                <p><strong>Usuario:</strong> {userNames[index]}</p>
                <p><strong>Calificación:</strong> <span className={Style.rating}>{review.rating}</span></p>
                <p className={Style.comment}><strong>Comentario:</strong> {review.comment}</p>
                <p className={Style.createdAt}><strong>Fecha:</strong> {new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay reseñas para este producto.</p>
        )}
        </div>
      </div>
    );
  };
  
  export default ProductDetailComponent;
  