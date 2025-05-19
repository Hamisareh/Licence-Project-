import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import { API_URL } from '/api/config';

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
      const res = await axios.get(`${API_URL}/api/auth/notification`, {
        headers: { Authorization: `Bearer ${token}` },
      });

     setNotifications(res.data.data.map(n => ({
  id_notif: n.id, // <-- on prend bien l'ID envoyé par le backend
  message: n.message || n.msg,
  date: n.date || n.date_creation,
  lu: n.lu === 1 || n.lu === true,
  expediteur: n.expediteur || 'Système'
})));

    } catch (error) {
      console.error("Fetch error:", error.response?.data || error.message);
    }
  };

 const markAsRead = async (id_notif) => {
  try {
    console.log('Tentative de requête PATCH vers:', `${API_URL}/api/auth/notification/${id_notif}/read`);
    
    const token = localStorage.getItem("token");
    const response = await axios({
      method: 'patch', // Utilisez 'patch' en minuscules
      url: `${API_URL}/api/auth/notification/${id_notif}/read`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      timeout: 3000
    });

    console.log('Réponse du serveur:', response.data);
    setNotifications(prev => 
      prev.map(n => 
        n.id_notif === id_notif ? { ...n, lu: true } : n
      )
    );
  } catch (error) {
    console.error('Erreur complète:', {
      config: error.config,
      response: error.response,
      message: error.message
    });
  }
};
  const unreadCount = notifications.filter(n => !n.lu).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) fetchNotifications();
        }}
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
  key={notif.id_notif}
  onClick={(e) => markAsRead(notif.id_notif, e)}
  className={`px-4 py-3 text-sm border-b hover:bg-gray-100 cursor-pointer ${
    notif.lu === 1 ? "text-gray-500" : "text-black font-medium bg-blue-50"
  }`}
>
  <div className="text-xs text-gray-400">
                  {new Date(notif.date).toLocaleString()}
                </div>
                <div>{notif.message}</div>
                <div className="text-xs text-gray-500 mt-1">
                  De: {notif.expediteur}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}