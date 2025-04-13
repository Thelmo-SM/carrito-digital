'use client';

import { useState } from 'react';
import styles from '@/styles/OrdersTable.module.css';
import sharedStyles from '@/styles/shared.module.css';
import { useAdminOrders } from '../hooks/useOrders';
import { orderTypes } from '@/types/ordersTypes';
import { updateOrderStatus } from '../services/updateOrderStatus'; // este lo implementamos ahora

const statusOptions = ['Pendiente', 'Enviado', 'Entregado', 'Cancelado'];

const OrdersTable = () => {
  const { orders, loading, error } = useAdminOrders(); // refresh es opcional si tu hook lo permite
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
    try {
      await updateOrderStatus(id, newStatus);
      setMessage('✅ Estado actualizado');
    } catch (err: unknown) {
      setMessage('Error al actualizar');
      console.log(err)
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
