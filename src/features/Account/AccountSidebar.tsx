// components/Dashboard/DashboardSidebar.tsx
import styles from '@/styles/account.module.css';
import Link from 'next/link';

export const AccountSidebar = () => {
return (
    <aside className={styles.headerContainer}>
      <h2 className={styles.logo}>Tu cuenta</h2>
      <nav className={styles.nav}>
        <ul>
        <li>
        <Link href= '/account/profile' >Perfil</Link>
        </li>
        <li>
        <Link href= '/account/orders' >Tus pedidos</Link>
        </li>
        <li>
        <Link href= '/account/reviews' >Tus reseñas</Link>
        </li>
        <li>
        <Link href= '/account/addresses' >Direcciones</Link>
        </li>
        <li>
        <Link href= '' >Notificaciones</Link>
        </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
