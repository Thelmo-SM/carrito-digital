// components/Dashboard/DashboardSidebar.tsx
'use client';

import styles from '@/styles/account.module.css';
import Link from 'next/link';
import { useNotifications } from '../notifications/useNotifications';
import { useEffect } from 'react';

export const AccountSidebar = () => {
    const { unreadCount, markAllAsRead } = useNotifications();

      useEffect(() => {
        markAllAsRead();
      }, []);

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
        <Link href= '' 
        className={styles.accoutNotifications}
        >
        Notificaciones
        {unreadCount > 0 && (
            <span className={styles.notificationBadge}>
              {unreadCount}
            </span>
            )}
        </Link>
        </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
