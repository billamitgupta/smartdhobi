import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  fetchNotifications,
  updateNotificationClick,
} from "../auth/ApiConnect";

const socket = io("https://api.smartdhobi.in");

const NotificationBell = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      socket.emit("join", userId);
    }
  }, [userId]);

  useEffect(() => {
    socket.on("receive-notification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });
    return () => socket.off("receive-notification");
  }, []);

  useEffect(() => {
    if (userId) {
      getNotifications();
    }
  }, [userId]);

  const getNotifications = async () => {
    try {
      const res = await fetchNotifications(userId);
      setNotifications(res);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const handleNotificationClick = (noti) => {
    setOpen(false);

    updateNotificationClick(noti);
    if (noti.type === "order" && noti.orderId) {
      navigate(`orders`);
    } else if (noti.type === "service") {
      navigate(`/services/${noti.orderId}`);
    } else {
      navigate(`/admin/users`);
    }
  };

  return (
    <div className="relative">
      <button
        className="relative text-gray-700 hover:text-black"
        onClick={() => setOpen(!open)}
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg z-50 max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500">No notifications</div>
          ) : (
            notifications.map((noti, index) => (
              <button
                key={index}
                onClick={() => handleNotificationClick(noti)}
                className="w-full text-left p-3 border-b hover:bg-gray-100 text-sm text-gray-700"
              >
                {noti.message}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
