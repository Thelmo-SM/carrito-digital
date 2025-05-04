'use client';

import { useState, useEffect } from "react";
//import { getUserOrders } from "@/utils/firebase";
import { getUserOrders } from "../services/ordersServices";
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';
import { orderTypes } from '@/types/ordersTypes';
import style from '@/styles/account.module.css';
import { LoaderUi } from "@/components/UI/LoaderUi";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/features/Dashboard/helpers/formatPrice";

export const OrdersComponent = () => {
  const [orders, setOrders] = useState<orderTypes[]>([]);
  const [loading, setLoading] = useState(false)
  const user = useAuthUsers();
  const router = useRouter();

  useEffect(() => {
    if (!user?.uid) return;
  
    setLoading(true);
  
    const fetchOrders = async () => {
      try {
        const userOrders = await getUserOrders(user.uid);
  
        // Asegurarnos de que cada orden tenga 'userId'
        const ordersWithUserId = userOrders.map(order => ({
          ...order,
          userId: user.uid, // Asignamos el userId al objeto
        }));
  
        setOrders(ordersWithUserId);
      } catch (error) {
        console.error("Error cargando órdenes:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  }, [user]);

  const handleOrderClick = (order: orderTypes) => {
    router.push(`/account/orders/${order.sessionId}`)
  };

  return (
    <div className={style.subContainer}>
      <h2 className={style.title}>Tus pedidos</h2>
      {loading ? (
          <div className={style.loadingContainer}>
          <LoaderUi />
          <p>{"Cargando tus pedidos..."}</p>
          </div>
      ) : orders.length === 0 ? <p className={style.cero}>No hay compras para mostrar.</p> :(
        <ul className={style.orderContainer}>
          {orders.map((order) => (
            
            <li key={order.id}
            className={style.cardContainer}
            >
              <h3>Pedido #{order.id}</h3>
              <p>Total: <span className={style.email}>{formatPrice(Number(order.total))}</span></p>
              <p>Estado:  
                 <span 
                className={`${order.status === 'Entregado' ? style.statusSuccess : style.statusP}`}>
                 {order.status}
                </span>
              </p>
              <p>Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
              <button onClick={() => {
               handleOrderClick(order)
              }
              
              }
                >
                  Ver detalles
                  </button> {/* Botón para ver detalles */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersComponent;
