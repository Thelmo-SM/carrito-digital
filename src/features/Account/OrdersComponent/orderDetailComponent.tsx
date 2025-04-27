'use client';

import React, { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
import { getOrderDetail } from '@/features/Account/services/orderDetail';
import { OrderDetailComponentProps } from '@/types/ordersTypes';
import styles from '@/styles/OrderDetailComponent.module.css';
import Image from 'next/image';
import Link from 'next/link';
import ReviewForm from '../ReviewsComponent/AddReviews';
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';

interface OrderDetailComponentProps1 {
  session_id: string; // Add the session_id prop here
}

const OrderDetailComponent = ({ session_id }: OrderDetailComponentProps1) => {
  // const { session_id } = useParams();
  const [order, setOrder] = useState<OrderDetailComponentProps | null>(null);
  const [showReviewForm, setShowReviewForm] = useState<{ [productId: string]: boolean }>({});
  const user = useAuthUsers();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!session_id || typeof session_id !== 'string') return;

      const data = await getOrderDetail(session_id);
      console.log('Order obtenida desde el cliente:', data);
      setOrder(data);
    };

    fetchOrder();
  }, [session_id]);

  if (!order) return <p>Cargando detalles de la orden...</p>;

  const { id, total, status, createdAt, products, shippingAddress } = order;

  const toggleReviewForm = (productId: string) => {
    setShowReviewForm((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const totalProductos = products.reduce((acc, product) => acc + product.quantity, 0);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Detalles de la Orden</h2>

      <div className={styles.orderInfo}>
        <p><strong>ID de la orden:</strong> {id}</p>
        <p><strong>Fecha de compra:</strong> {new Date(createdAt).toLocaleDateString()}</p>
        <p><strong>Catidad de productos:</strong> {totalProductos}</p>
        <p><strong>Estado:</strong> <span className={`${status === 'Entregado' ? styles.statusSuccess: ''}`}>{status}</span></p>
        <p><strong>Total:</strong> RD${total.toLocaleString()}</p>
      </div>

      <div className={styles.shippingAddress}>
        <h3>Dirección de envío</h3>
        <p>{shippingAddress.street}</p>
        <p>{shippingAddress.city}, {shippingAddress.state}</p>
        <p>{shippingAddress.postalCode}, {shippingAddress.country}</p>
      </div>

      <div className={styles.products}>
        <h3>Productos comprados</h3>
        <ul>
          {products.map((product) => (
          <li key={product.id} className={styles.product}>
          <div className={styles.productTop}>
            <Image 
              src={product.imageUrl} 
              alt={product.name} 
              className={styles.productImage} 
              width={100} 
              height={100}
            />
        
            <div className={styles.productContent}>
              <p><strong>{product.name}</strong></p>
              <p>Precio: RD${product.price}</p>
              <p>Cantidad: {product.quantity}</p>
              <p><strong>Total: RD${(parseInt(product.price) * product.quantity).toLocaleString()}</strong></p>
        
              <div className={styles.actions}>
                <Link href={`/products/${product.id}`} className={styles.verProduct}>
                  Ver producto
                </Link>
        
                {status === 'Entregado' && (
                  <button
                    onClick={() => toggleReviewForm(product.id)}
                    className={styles.reviewButton}
                  >
                    {showReviewForm[product.id] ? 'Ocultar reseña' : 'Dejar reseña'}
                  </button>
                )}
              </div>
            </div>
          </div>
        
          {showReviewForm[product.id] && (
            <div className={styles.reviewFormContainer}>
              <ReviewForm
                productId={product.id}
                userId={user?.uid}
                key={`form-${product.id}`}
              />
            </div>
          )}
        </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetailComponent;