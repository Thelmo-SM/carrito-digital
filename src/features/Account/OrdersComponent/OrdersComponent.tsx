'use client';

import { useState, useEffect } from "react";
import { getUserOrders } from "@/utils/firebase";
import { useAuthUsers } from '@/features/Auth/hooks/authUsers';
import { orderTypes } from '@/types/ordersTypes';
import style from '@/styles/account.module.css';
import Image from "next/image";
import ReviewForm from "../ReviewsComponent/AddReviews";
import { useModalForm } from "@/hooks/useModalForm";
import ModalForm from "@/components/Modals/modalForm";
import { LoaderUi } from "@/components/UI/LoaderUi";
import Link from "next/link";

export const OrdersComponent = () => {
  const [orders, setOrders] = useState<orderTypes[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<orderTypes | null>(null);
  const {isOpen, openModal, closeModal} = useModalForm();
  const [loading, setLoading] = useState(false)
  const user = useAuthUsers();

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);

    const fetchOrders = async () => {
      try {
        const userOrders = await getUserOrders(user.uid);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error cargando órdenes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleOrderClick = (order: orderTypes) => {
    setSelectedOrder(order); // Establecer la orden seleccionada
  };

  return (
    <div className={style.subContainer}>
      <h2 className={style.title}>Tus pedidos</h2>
      {loading ? (
          <div className={style.loadingContainer}>
          <LoaderUi />
          <p>{"Cargando tus pedidos..."}</p>
          </div>
      ) : orders.length === 0 ? <p>No hay compras para mostrar.</p> :(
        <ul className={style.orderContainer}>
          {orders.map((order) => (
            <li key={order.id}
            className={style.cardContainer}
            >
              <h3>Pedido #{order.id}</h3>
              <p>Total: ${order.total}</p>
              <p>Estado:  
                 <span 
                className={`${order.status === 'Entregado' ? style.statusSuccess : style.statusP}`}>
                 {order.status}
                </span>
              </p>
              <p>Fecha: {new Date(order.createdAt).toLocaleDateString()}</p>
              <button onClick={() => {
               handleOrderClick(order)
               openModal()
              }
              
              }
                >
                  Ver detalles
                  </button> {/* Botón para ver detalles */}
            </li>
          ))}
        </ul>
      )}

      {/* Mostrar detalles si hay una orden seleccionada */}
      {selectedOrder && (
          <ModalForm isOpens={isOpen} closeModal={closeModal}>
        <div className={`${selectedOrder.status === 'Entregado' ? style.orderDetailsEntregado : style.orderDetails}`}>
          <h2 className={style.title}>Detalles del Pedido #{selectedOrder.id}</h2>
          <div className={style.status}>
          <p  className={style.text}>Total: ${selectedOrder.total}</p>
          <p className={style.text}>Estado: 
          <span className={`${selectedOrder.status === 'Entregado' ? style.statusSuccess : style.statusP}`}> 
          {selectedOrder.status}
          </span>
          </p>
          <p className={style.text}>Fecha: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
          </div>
          <h3 className={style.text}>Productos:</h3>
          <ul className={style.productList}>
            {selectedOrder.products.map((product, index) => (
              <li key={index}
              className={style.productItem}
              >
                {/* Mostrar imagen del producto */}
                <div>
                {product.imageUrl && 
                <Image src={product.imageUrl} 
                alt={product.name} 
                width={50} 
                height={50} 
                className={style.productItem}
                />}
                <div className={style.productInfo}>
                  <span className={style.productInfo}>{product.name}</span> - ${product.price} x {product.quantity}
                  </div>
                  <Link href={`/products/${product.id}`}
                  className={style.verProduct}
                  >
                  ver producto
                  </Link>
                  </div>
                {
                selectedOrder.status === 'Entregado' &&
                <ReviewForm 
                productId={product.id} 
                userId={user?.uid} 
                key={index}/>
                }
              </li>
            ))}
          </ul>

          {/* Mostrar dirección de envío de la orden */}
          <h3 className={style.shippingAddress}>Dirección de Envío:</h3>
          {selectedOrder.shippingAddress ? (
            <p>
              {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}, {selectedOrder.shippingAddress.postalCode}, {selectedOrder.shippingAddress.country}
            </p>
          ) : (
            <p>No se ha proporcionado una dirección de envío.</p>
          )}
        </div>
        </ModalForm>
      )}
    </div>
  );
};

export default OrdersComponent;
