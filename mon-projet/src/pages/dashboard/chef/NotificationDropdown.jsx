import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bell } from "lucide-react";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/notification", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data.data);
    } catch (error) {
      console.error("Erreur notifications", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/notification/${id}/read`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // mettre à jour localement
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, lu: 1 } : notif
        )
      );
    } catch (error) {
      console.error("Erreur lecture notification", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.lu).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative focus:outline-none"
        aria-label="Notifications"
      >
        <Bell size={24} className="text-gray-600 hover:text-primary" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5 font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          <div className="p-3 font-semibold text-gray-700 border-b">Notifications</div>
          <ul className="max-h-64 overflow-auto">
            {notifications.length === 0 && (
              <li className="px-4 py-3 text-sm text-gray-500">Aucune notification</li>
            )}
            {notifications.map((notif) => (
              <li
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={`px-4 py-3 text-sm border-b hover:bg-gray-100 cursor-pointer ${
                  notif.lu ? "text-gray-500" : "text-black font-medium"
                }`}
              >
                <div className="text-xs text-gray-400">
                  {new Date(notif.date).toLocaleString()}
                </div>
                <div>{notif.message}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
