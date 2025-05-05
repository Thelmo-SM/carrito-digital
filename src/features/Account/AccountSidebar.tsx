// components/Dashboard/DashboardSidebar.tsx
'use client';

import styles from '@/styles/account.module.css';
import Link from 'next/link';
import { useNotifications } from '../notifications/hooks/useNotifications';
import { useEffect } from 'react';
import { useChatNotificationContext } from '../notifications/hooks/useMessageNotification';
import { markMessagesAsSeenS } from '../Message/services/sendMessageService';

export const AccountSidebar = () => {
    const { unreadCount, markAllAsRead } = useNotifications();
      const { hasNewMessage, markMessagesAsSeen } = useChatNotificationContext();

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
        <li>
        <Link 
        href='/account/messages'
        onClick={() => {
          markMessagesAsSeen()
          markMessagesAsSeenS()
        }
        }
        >
          Mensajes
          {hasNewMessage && (
          <span className={styles.notificationBadge}>
              ...
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
