'use client';


import styles from '@/styles/RecentOrders.module.css';
import { useAdminOrders } from '../hooks/useOrders';

const RecentOrders = () => {
  const { orders, loading } = useAdminOrders();

  if (loading) return <p>Cargando órdenes...</p>;

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Órdenes recientes</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id.slice(0, 6)}</td>
                <td>{order.client}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.total.toLocaleString()}</td>
                <td>
                  <span className={`${styles.badge} ${styles[order.status.toLowerCase()]}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentOrders;