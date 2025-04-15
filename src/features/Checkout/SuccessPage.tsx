'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { orderTypes } from '@/types/ordersTypes';
import { useRouter } from 'next/navigation';
import styles from '@/styles/SuccessPage.module.css';

type VerifyResponse = {
  status: 'paid' | 'unpaid';
  order?: orderTypes | null; // Permite que 'order' sea null
};

const SuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<VerifyResponse | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter()

  useEffect(() => {
    const session_id = searchParams.get('session_id'); // Capturar el session_id de la URL
    console.log('Session ID:', session_id);  

    if (session_id) {
      // Realizar la llamada al endpoint para verificar el pago
      fetch(`/api/verify-payment?session_id=${session_id}`)
        .then((res) => res.json())
        .then((data) => {
          console.log('Respuesta del servidor:', data); // Verifica la respuesta aquí
          if (data.status === 'paid') {
            if (data.order) {
              setOrder(data); // Mostrar detalles de la orden si existe
            } else {
              console.error('La orden es nula');
              setOrder(null);
              alert('Hubo un problema con la orden. Intenta nuevamente.');
            }
          } else {
            console.error('El pago no fue exitoso');
            setOrder(null);
            alert('Hubo un problema con el pago.');
          }
        })
        .catch((error) => {
          console.error('Error al verificar el pago:', error);
          alert('Hubo un error al verificar el pago. Intenta nuevamente.');
        })
        .finally(() => setLoading(false));
    }
  }, [searchParams]); // Usar searchParams en lugar de router.query

  if (loading) return <p>Cargando...</p>;

  const handleRedirect = () => {
    if (order && order.order) {
      router.push(`/account/orders/${order.order.sessionId}`); // Redirigir a la página de detalles
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>¡Pago Exitoso!</h1>
      {order ? (
        order.order ? (
          <div className={styles.card}>
            <p>Tu pedido ID: <strong>{order.order.id}</strong></p>
            <p><strong>Cliente:</strong> {order.order.client}</p>
            <p><strong>Total:</strong> ${order.order.total}</p>
            <div className={styles.orderDetails}>
              <p><strong>Dirección de Envío:</strong> {order.order.shippingAddress?.street}, {order.order.shippingAddress?.city}, {order.order.shippingAddress?.state}, {order.order.shippingAddress?.country}</p>
              <p><strong>Estado de la Orden:</strong> {order.order.status}</p>
              <h3>Productos:</h3>
              {order.order.products.map((product, index) => (
                <div key={index}>
                  <p><strong>{product.name}</strong></p>
                  <p>Cantidad: {product.quantity} - Precio: ${product.price}</p>
                </div>
              ))}
            </div>
            <button 
            className={styles.button}
            onClick={handleRedirect}
            >
              Ver más detalles
            </button>
          </div>
        ) : (
          <p className={styles.errorMessage}>Hubo un problema con la orden. Intenta nuevamente.</p>
        )
      ) : (
        <p className={styles.errorMessage}>Hubo un problema con el pago o la orden. Intenta nuevamente.</p>
      )}
    </div>
  );
};

export default SuccessPage;

