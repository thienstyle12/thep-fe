import { reactive } from 'vue';

export interface NotificationState {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

const notification = reactive<NotificationState>({
  isOpen: false,
  type: 'info',
  title: '',
  message: ''
});

export function useNotification() {
  const showNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string
  ) => {
    notification.type = type;
    notification.title = title;
    notification.message = message;
    notification.isOpen = true;
  };

  const closeNotification = () => {
    notification.isOpen = false;
  };

  return {
    notification,
    showNotification,
    closeNotification
  };
}
