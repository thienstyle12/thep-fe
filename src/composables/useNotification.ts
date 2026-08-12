import { reactive } from 'vue';

export interface NotificationState {
  isOpen: boolean;
  mode: 'alert' | 'confirm';
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void | Promise<void>;
}

const notification = reactive<NotificationState>({
  isOpen: false,
  mode: 'alert',
  type: 'info',
  title: '',
  message: '',
  confirmText: 'Xác Nhận',
  cancelText: 'Hủy Bỏ'
});

export function useNotification() {
  const showNotification = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    message: string
  ) => {
    notification.mode = 'alert';
    notification.type = type;
    notification.title = title;
    notification.message = message;
    notification.isOpen = true;
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void | Promise<void>,
    options?: { confirmText?: string; cancelText?: string; type?: 'warning' | 'error' }
  ) => {
    notification.mode = 'confirm';
    notification.type = options?.type || 'warning';
    notification.title = title;
    notification.message = message;
    notification.confirmText = options?.confirmText || 'Xác Nhận';
    notification.cancelText = options?.cancelText || 'Hủy Bỏ';
    notification.onConfirm = onConfirm;
    notification.isOpen = true;
  };

  const closeNotification = () => {
    notification.isOpen = false;
  };

  const handleConfirm = async () => {
    if (notification.onConfirm) {
      await notification.onConfirm();
    }
    notification.isOpen = false;
  };

  return {
    notification,
    showNotification,
    showConfirm,
    closeNotification,
    handleConfirm
  };
}
