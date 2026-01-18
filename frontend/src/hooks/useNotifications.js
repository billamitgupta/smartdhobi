import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketService from "../socket";
import {
  addNotification,
  setNotifications,
  markAsRead,
  setLoading,
  setError,
} from "../store/slices/notificationSlice";
import { useGetNotificationsQuery, useMarkNotificationAsReadMutation } from "../store/api/notificationApi";

export const useNotifications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications, unreadCount } = useSelector((state) => state.notification);
  
  const { data, isLoading, error } = useGetNotificationsQuery(undefined, {
    skip: !user,
  });
  
  const [markAsReadMutation] = useMarkNotificationAsReadMutation();

  // Initialize socket connection and listeners
  useEffect(() => {
    if (!user?._id) return;

    // Connect to socket
    socketService.connect(user._id);

    // Listen for new notifications
    const handleNewNotification = (notification) => {
      dispatch(addNotification(notification));
      
      // Optional: Show browser notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("New Notification", {
          body: notification.message,
          icon: "/notification-icon.png",
        });
      }
    };

    socketService.on("receive-notification", handleNewNotification);

    // Load initial notifications
    if (data?.notifications) {
      dispatch(setNotifications(data.notifications));
    }

    // Cleanup
    return () => {
      socketService.off("receive-notification", handleNewNotification);
    };
  }, [user, data, dispatch]);

  // Request browser notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const markNotificationAsRead = useCallback(
    async (notificationId) => {
      try {
        await markAsReadMutation(notificationId).unwrap();
        dispatch(markAsRead(notificationId));
      } catch (err) {
        console.error("Failed to mark notification as read:", err);
      }
    },
    [markAsReadMutation, dispatch]
  );

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markNotificationAsRead,
  };
};