import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  UserCircle,
  KeyRound,
  LogOut,
} from "lucide-react";

export default function SidebarAdmin() {
 const navLinks = [
  {
    to: "/admin/profil",
    label: "Mon Profil",
    icon: <UserCircle size={18} />,
  },
  {
    to: "/admin/modifier-mot-de-passe",
    label: "Modifier mot de passe",
    icon: <KeyRound size={18} />,
  },
  {
    to: "/admin/gestion-chefs",
    label: "Gestion des Chefs",
    icon: <Users size={18} />,
  },
  {
    to: "/admin/statistiques",
    label: "Statistiques",
    icon: <BarChart2 size={18} />,
  },
  {
    to: "/admin/logout",
    label: "Déconnexion",
    icon: <LogOut size={18} />,
  }
];

  return (
    <aside className="w-64 h-screen bg-white shadow-lg rounded-r-3xl px-6 py-8 flex flex-col fixed top-0 left-0 z-50">
      <h1 className="text-3xl font-bold mb-8 select-none cursor-default">
        <span className="text-[#ff7b00]">Stage</span>
        <span className="text-[#000041]">Flow</span>
      </h1>

      <nav className="flex flex-col gap-2 flex-grow">
        {navLinks.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors ${
                isActive
                  ? "bg-[#000041] text-white"
                  : "text-gray-700 hover:bg-[#ff7b00]/20"
              }`
            }
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="text-xs text-gray-400 text-center mt-6 select-none">
        © {new Date().getFullYear()} StageFlow
      </div>
    </aside>
  );
}