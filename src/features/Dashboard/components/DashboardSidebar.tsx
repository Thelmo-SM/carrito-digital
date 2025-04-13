// components/Dashboard/DashboardSidebar.tsx
import styles from '@/styles/DashboardSidebar.module.css';
import Link from 'next/link';

export const DashboardSidebar = () => {
return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>Panel Administrativo</h2>
      <nav>
        <ul>
          <li><Link href="/dashboard">Dashboard</Link></li>
          <li><Link href="/dashboard/products">Productos</Link></li>
          <li><Link href="/dashboard/orders">Pedidos</Link></li>
          <li><Link href="/dashboard/customers">Clientes</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
