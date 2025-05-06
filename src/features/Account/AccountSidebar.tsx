'use client';

import styles from '@/styles/account.module.css';
import Link from 'next/link';
import { useNotifications } from '../notifications/hooks/useNotifications';
import { useEffect } from 'react';
import { useChatNotificationContext } from '../notifications/hooks/useMessageNotification';

export const AccountSidebar = () => {
    const { unreadCount, markAllAsRead } = useNotifications();
    const { hasNewNotification, markNotificationsAsSeen } = useChatNotificationContext();


    useEffect(() => {
        markAllAsRead();
    }, []);

    return (
        <aside className={styles.headerContainer}>
            <h2 className={styles.logo}>Tu cuenta</h2>
            <nav className={styles.nav}>
                <ul>
                    <li>
                        <Link href='/account/profile'>Perfil</Link>
                    </li>
                    <li>
                        <Link href='/account/orders'>Tus pedidos</Link>
                    </li>
                    <li>
                        <Link href='/account/reviews'>Tus reseñas</Link>
                    </li>
                    <li>
                        <Link href='/account/addresses'>Direcciones</Link>
                    </li>
                    <li>
                        <Link
                            href='/account/notifications'
                            className={styles.accoutNotifications}
                            onClick={() => markAllAsRead()}
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
                                markNotificationsAsSeen()
                            }}
                        >
                            Mensajes
                            {hasNewNotification && (
                                <span className={styles.notificationBadge}>
                                    ●
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
