'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { orderTypes } from '@/types/ordersTypes';
import { useRouter } from 'next/navigation';
import { LoaderStatusd } from '@/components/UI/LoaderUi';
import styles from '@/styles/SuccessPage.module.css';
import { useAuthUsers } from '../Auth/hooks/authUsers';

type VerifyResponse = {
  status: 'paid' | 'unpaid';
  order?: orderTypes | null; // Permite que 'order' sea null
};

const SuccessPage = () => {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<VerifyResponse | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useAuthUsers();

  useEffect(() => {
    const session_id = searchParams.get('session_id');
    if (!session_id || !user) return;
  
    const fetchOrder = async (retries = 5) => {
      try {
        const res = await fetch(`/api/verify-payment?session_id=${session_id}`);
        const data = await res.json();
        console.log('Respuesta del servidor:', data);
  
        if (data.status === 'paid' && data.order) {
          setOrder(data);
        } else {
          if (retries > 0) {
            console.log(`Reintentando... (${6 - retries}/5)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            fetchOrder(retries - 1);
          } else {
            console.error('No se pudo obtener la orden después de varios intentos');
            alert('Hubo un problema con la orden. Intenta nuevamente.');
            setOrder(null);
          }
        }
      } catch (error) {
        console.error('Error al verificar el pago:', error);
        alert('Hubo un error al verificar el pago. Intenta nuevamente.');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrder();
  }, [searchParams, user]);
  

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <h2>Estamos procesando tu pedido...</h2>
        <LoaderStatusd>
        Esto puede tardar unos segundos. No cierres esta página.
        </LoaderStatusd>
        {/* <div className={styles.spinner}></div> */}
      </div>
    );
  }

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
            <p><strong>Cliente:</strong> {order.order.client} {order.order.client}</p>
            <p><strong>Total:</strong> ${order.order.total}</p>
            <div className={styles.orderDetails}>
              <p><strong>Dirección de Envío:</strong> 
                {order.order.shippingAddress ? 
                  `${order.order.shippingAddress.state}, ${order.order.shippingAddress.city}, ${order.order.shippingAddress.state}, ${order.order.shippingAddress.country}` 
                  : "Dirección no disponible"
                }
              </p>
              <p><strong>Estado de la Orden:</strong> {order.order.status}</p>
              <h3>Productos:</h3>
              {Array.isArray(order.order.products) && order.order.products.length > 0 ? (
                order.order.products.map((product, index) => (
                  <div key={index}>
                    <p><strong>{product.name}</strong></p>
                    <p>Cantidad: {product.quantity} - Precio: ${product.price}</p>
                  </div>
                ))
              ) : (
                <p>No hay productos en esta orden.</p>
              )}
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
