'use client';

import { useNotifications } from "./useNotifications";
import styles from "./NotificationBell.module.css";

export default function NotificationsPage() {
  const { notifications } = useNotifications();

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.h2}>Todas las Notificaciones</h2>

      {notifications.length === 0 ? (
        <p>No tienes notificaciones.</p>
      ) : (
        <ul className={styles.list}>
          {notifications.map((noti) => (
            <li key={noti.id} className={noti.read ? styles.read : styles.unread}>
              <div className={styles.item}>
                <h4 className={styles.title}>{noti.title}</h4>
                <p
                  className={styles.body}
                  dangerouslySetInnerHTML={{ __html: noti.body }}
                />
                <small className={styles.date}>
                  {new Date(noti.createdAt?.toDate()).toLocaleString()}
                </small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
