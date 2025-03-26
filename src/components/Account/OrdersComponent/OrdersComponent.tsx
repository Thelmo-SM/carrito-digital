'use client';

import style from '@/styles/account.module.css';
import { useEffect, useState } from "react";
import { getUserOrders } from "@/utils/firebase";
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';
import { orderTypes } from '@/types/ordersTypes';


export const OrdersComponent = () => {

    const [orders, setOrders] = useState<orderTypes[]>([]);
    const user  = useAuthUsers(); // Usuario autenticado
  
    useEffect(() => {
      if (!user?.uid) return;
  
      const fetchOrders = async () => {
        try {
          const userOrders = await getUserOrders(user.uid);
          setOrders(userOrders);
        } catch (error) {
          console.error("Error cargando órdenes:", error);
        }
      };
  
      fetchOrders();
    }, [user]);
  
    return (
      <div>
        <h2>Historial de Compras</h2>
        {orders.length === 0 ? (
          <p>No tienes compras registradas.</p>
        ) : (
          <ul>
            {orders.map((order) => (
              <li key={order.id}>
                <h3>Pedido #{order.id}</h3>
                <p>Total: ${order.total}</p>
                <p>Estado: {order.status}</p>
                <p>Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
                <ul>
                  {/* Verificar que 'products' sea un array antes de mapear */}
                  {Array.isArray(order.products) ? (
                    order.products.map((product, index) => (
                      <li key={index}>
                        {product.name} - ${product.price} x {product.quantity}
                      </li>
                    ))
                  ) : (
                    <p>Productos no disponibles</p>
                  )}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
};

export default OrdersComponent;