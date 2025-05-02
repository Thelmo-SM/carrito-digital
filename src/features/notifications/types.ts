import { Timestamp } from "firebase/firestore";

export interface NotificationTypes {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'order_success' | 'order_update' | 'welcome' | string;
    isRead: boolean;
    createdAt: Timestamp;
  }
  