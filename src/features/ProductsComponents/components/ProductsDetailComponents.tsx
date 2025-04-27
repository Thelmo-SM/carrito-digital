'use client';

import { formatPrice } from "@/features/Dashboard/helpers/formatPrice";
// import Style from '@/styles/products.module.css';
import Style from '../../../styles/DetailsProduct.module.css'
import Image from "next/image";
import { detailProduct } from "@/types/productTypes";
import { useCart } from "@/store/ProductCartContext";
// import { getUserName } from "@/utils/firebase";
import { getUserName } from "@/features/Account/services/reviewsServices";
import { useEffect, useState } from "react";
import { IsAuthenticated } from "@/components/UI/Message";
import ModalForm from "@/components/Modals/modalForm";
import { useModalForm } from "@/hooks/useModalForm";
import { useAuthUsers } from "../../Auth/hooks/authUsers";
import Link from "next/link";

export const ProductDetailComponent = ({
  id,
  name,
  price,
  soldUnits,
  description,
  imageUrl,
  reviews,
}: detailProduct) => {
  const { cart,  handleAddToCard, updateProductQuantity } = useCart();
  const [userNames, setUserNames] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isProductAdded, setIsProductAdded] = useState(false);
  const { isOpen, openModal, closeModal } = useModalForm();
  const user = useAuthUsers();

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

  // Manejadores para aumentar y disminuir la cantidad
  const handleIncrease = () => {
    if (quantity < soldUnits) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.max(1, Math.min(soldUnits, Number(e.target.value)));
    setQuantity(newQuantity);
  };

  // Manejar la adición al carrito con la cantidad ajustada
  const handleAddProduct = () => {
    if (!user) {
      // Si no está autenticado, abrir el modal
      openModal();
      return; // Evitar agregar el producto al carrito
    }

    const existingProduct = cart.find(item => item.id === id);
  
    if (existingProduct) {
      // Si el producto ya está en el carrito, actualizamos la cantidad
      updateProductQuantity(id, (existingProduct.units ?? 0) + quantity);  // Sumar la cantidad actual con la nueva
    } else {
      // Si el producto no está en el carrito, lo agregamos con la cantidad seleccionada
      handleAddToCard(
        {
          name,
          soldUnits,
          price,
          imageUrl,
          id: id, // Usar el id como número o string según corresponda
        },
        quantity // Pasamos la cantidad seleccionada por el usuario
      );
    }

    // Establecer estado de producto agregado
    setIsProductAdded(true);

    // Reiniciar estado después de 3 segundos
    setTimeout(() => {
      setIsProductAdded(false);
    }, 3000);
  };

  return (
    <div className={Style.dContainer}>
        <Link 
        className={Style.volver}
        href='/products'
        >
          Volver
        </Link>
      {/* Mensaje de éxito */}
      <div className={Style.successMessage}>
        {isProductAdded && <p>✅ Artículo añadido al carrito.</p>}
      </div>
      
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

          {/* Contador de cantidad */}
          <div className={Style.quantityControl}>
            <button onClick={handleDecrease} className={Style.decrease}>-</button>
            <input
              type="number"
              value={quantity}
              onChange={handleInputChange}
              min="1"
              max={soldUnits}
              className={Style.quantityInput}
            />
            <button onClick={handleIncrease} className={Style.increase}>+</button>
          </div>

          <div className={isProductAdded ? Style.añadido : Style.compra}>
            <button onClick={handleAddProduct}>
              {isProductAdded ? '✔' : 'AÑADIR AL CARRITO'}
            </button>
          </div>
        </div>
      </div>

      <div className={Style.reviewsContainer}>
        <h3>Reseñas</h3>
        {reviews.length > 0 ? (
          <div className={Style.reviews}>
            {reviews.map((review, index) => (
              <div key={review.id} className={Style.review}>
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

      <ModalForm isOpens={isOpen} closeModal={closeModal}>
              
              <IsAuthenticated />
            
      </ModalForm>
    </div>
  );
};

export default ProductDetailComponent;
