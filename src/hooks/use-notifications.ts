"use client";

import { useState, useCallback, useRef } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const notificationRef = useRef<Notification | null>(null);

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    const currentPermission = await Notification.requestPermission();
    setPermission(currentPermission);
  }, []);

  const showNotification = useCallback((title: string, body: string) => {
    if (permission !== 'granted') {
      return;
    }

    // Close any existing notification before showing a new one
    if (notificationRef.current) {
        notificationRef.current.close();
    }

    const newNotification = new Notification(title, {
      body,
      tag: 'dhvani-status', // Use a tag to prevent multiple notifications
      silent: true, // No sound for the notification
      icon: '/favicon.ico', // Optional: you can add an icon
    });

    notificationRef.current = newNotification;

    newNotification.onclick = () => {
        window.focus();
        newNotification.close();
    };
  }, [permission]);

  const closeNotification = useCallback(() => {
    if (notificationRef.current) {
        notificationRef.current.close();
        notificationRef.current = null;
    }
  }, []);

  return { requestPermission, showNotification, closeNotification };
};
