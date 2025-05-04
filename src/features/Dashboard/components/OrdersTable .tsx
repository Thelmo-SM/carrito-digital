'use client';

import { useState } from 'react';
import styles from '@/styles/OrdersTable.module.css';
import sharedStyles from '@/styles/shared.module.css';
import { useAdminOrders } from '../hooks/useOrders';
import { orderTypes } from '@/types/ordersTypes';
import { updateOrderStatus } from '../services/updateOrderStatus';
import { createNotification } from '@/features/notifications/createNotification';

const statusOptions = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];

const OrdersTable = () => {
  const { orders, loading, error } = useAdminOrders();
  const [selectedStatuses, setSelectedStatuses] = useState<{ [id: string]: string }>({});
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const handleStatusChange = (id: string, newStatus: string) => {
    setSelectedStatuses((prev) => ({ ...prev, [id]: newStatus }));
  };

  const handleUpdate = async (id: string) => {
    const newStatus = selectedStatuses[id];
    if (!newStatus) return;
  
    setUpdatingOrderId(id);
    // Buscar la orden correcta por el ID de la orden
    const currentOrder = orders.find((o) => o.id === id);
  
    if (!currentOrder) {
      console.log("Orden no encontrada");
      setMessage("Orden no encontrada");
      return;
    }
  
    try {
      // Actualizamos el estado de la orden
      await updateOrderStatus(id, newStatus);
  
      // Verificamos si el currentOrder tiene el userId
      if (currentOrder?.userId) {
        // Aquí accedes al userId de la orden para obtener los datos del cliente
        console.log("Cliente encontrado:", currentOrder.client);
  
        // Se envía la notificación al cliente
        await createNotification(
          currentOrder.userId,  // Enviamos la notificación usando el userId
          'Actualización de tu pedido',
          `El estado de tu pedido ha cambiado a: ${newStatus} 
          <a href="/account/orders/${currentOrder.sessionId}" style="color: #437BAF; text-decoration: underline;" target="_blank">Ver detalles de tu compra aquí</a>`
        );
        console.log("Notificación enviada correctamente.");
      } else {
        console.log("No se encontró el userId en la orden");
      }
  
      setMessage('✅ Estado actualizado');
    } catch (err: unknown) {
      setMessage('Error al actualizar');
      console.log(err);
    } finally {
      setUpdatingOrderId(null);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p>Error al cargar pedidos.</p>;

  return (
    <div className={styles.container}>
      <h2>Órdenes recientes</h2>
      {message && <p className={styles.message}>{message}</p>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.cell}>ID</th>
            <th className={styles.cell}>Cliente</th>
            <th className={styles.cell}>Fecha</th>
            <th className={styles.cell}>Total</th>
            <th className={styles.cell}>Estado</th>
            <th className={styles.cell}>Actualizar</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: orderTypes) => (
            <tr key={order.id}>
              <td className={styles.cell}>{order.id}</td>
              <td className={styles.cell}>{order.client}</td>
              <td className={styles.cell}>
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className={styles.cell}>${order.total}</td>
              <td className={styles.cell}>
                <select
                  value={selectedStatuses[order.id] || order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={styles.select}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className={styles.cell}>
                <button
                  className={sharedStyles.btn}
                  onClick={() => handleUpdate(order.id)}
                  disabled={updatingOrderId === order.id}
                >
                  {updatingOrderId === order.id ? 'Actualizando...' : 'Actualizar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
