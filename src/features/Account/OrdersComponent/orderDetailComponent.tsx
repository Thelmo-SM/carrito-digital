'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getOrderDetail } from '@/features/Account/services/orderDetail';
import { OrderDetailComponentProps } from '@/types/ordersTypes';
import styles from '@/styles/OrderDetailComponent.module.css';
import Image from 'next/image';
import Link from 'next/link';

const OrderDetailComponent = () => {
  const { session_id } = useParams();
  const [order, setOrder] = useState<OrderDetailComponentProps | null>(null);

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

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Detalles de la Orden</h2>
      
      <div className={styles.orderInfo}>
        <p><strong>ID de la orden:</strong> {id}</p>
        <p><strong>Fecha de compra:</strong> {createdAt.toLocaleDateString()}</p>
        <p><strong>Estado:</strong> {status}</p>
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
              <Image src={product.imageUrl} 
              alt={product.name} 
              className={styles.productImage} 
              width={400} height={400}
              />
              <div>
                <p><strong>{product.name}</strong></p>
                <p>Precio: RD${product.price}</p>
                <p>Cantidad: {product.quantity}</p>
                <p><strong>Total: RD${(parseInt(product.price) * product.quantity).toLocaleString()}</strong></p>
              </div>
              <Link href={`/products/${product.id}`}>Ver producto</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetailComponent;
