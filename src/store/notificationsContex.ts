import { useState } from 'react';

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

const useNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { message, type },
    ]);
  };

  const closeNotification = (index: number) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index)
    );
  };

  return {
    notifications,
    addNotification,
    closeNotification,
  };
};

export default useNotification;
