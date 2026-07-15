import React from 'react';
import { Toast as BootstrapToast, ToastContainer } from 'react-bootstrap';
import { useNotification } from '../hooks/useNotification';

const Toast = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <ToastContainer position="top-end" className="p-3">
      {notifications.map((notification) => (
        <BootstrapToast
          key={notification.id}
          onClose={() => removeNotification(notification.id)}
          show={true}
          delay={3000}
          autohide
          bg={notification.type}
          className="mb-2"
        >
          <BootstrapToast.Body className={notification.type === 'danger' ? 'text-white' : ''}>
            {notification.message}
          </BootstrapToast.Body>
        </BootstrapToast>
      ))}
    </ToastContainer>
  );
};

export default Toast;
