'use client';

import { useState, useEffect } from "react";
import { getUserOrders } from "@/utils/firebase";
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';
import { orderTypes } from '@/types/ordersTypes';
import style from '@/styles/account.module.css';
import Image from "next/image";

export const OrdersComponent = () => {
  const [orders, setOrders] = useState<orderTypes[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<orderTypes | null>(null); // Estado para la orden seleccionada
  const user = useAuthUsers(); // Usuario autenticado

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

  const handleOrderClick = (order: orderTypes) => {
    setSelectedOrder(order); // Establecer la orden seleccionada
  };

  return (
    <div className={style.subContainer}>
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
              <button onClick={() => handleOrderClick(order)}>Ver detalles</button> {/* Botón para ver detalles */}
            </li>
          ))}
        </ul>
      )}

      {/* Mostrar detalles si hay una orden seleccionada */}
      {selectedOrder && (
        <div className={style.orderDetails}>
          <h2>Detalles del Pedido #{selectedOrder.id}</h2>
          <p>Total: ${selectedOrder.total}</p>
          <p>Estado: {selectedOrder.status}</p>
          <p>Fecha: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
          <h3>Productos:</h3>
          <ul>
            {selectedOrder.products.map((product, index) => (
              <li key={index}>
                {/* Mostrar imagen del producto */}
                {product.imageUrl && <Image src={product.imageUrl} alt={product.name} width={50} height={50} />}
                <div>{product.name} - ${product.price} x {product.quantity}</div>
              </li>
            ))}
          </ul>

          {/* Mostrar dirección de envío de la orden */}
          <h3>Dirección de Envío:</h3>
          {selectedOrder.shippingAddress ? (
            <p>
              {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
            </p>
          ) : (
            <p>No se ha proporcionado una dirección de envío.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersComponent;
