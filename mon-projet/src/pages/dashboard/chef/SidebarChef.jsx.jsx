import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  UserCircle,
  KeyRound,
  LogOut,
  Info,
} from "lucide-react";

export default function SidebarChef() {
  const navLinks = [
    {
      to: "/chef",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      to: "/chef/candidatures",
      label: "Candidatures",
      icon: <FileText size={18} />,
    },
    {
      to: "/chef/stagiaires",
      label: "Stagiaires",
      icon: <Users size={18} />,
    },
    {
      to: "/chef/profil",
      label: "Profil",
      icon: <UserCircle size={18} />,
    },
    {
      to: "/chef/modifier-mot-de-passe",
      label: "Changer mot de passe",
      icon: <KeyRound size={18} />,
    },
    {
      to: "/chef/infos",
      label: "Conditions & Aide",
      icon: <Info size={18} />,
    },
    {
      to: "/chef/logout",
      label: "Déconnexion",
      icon: <LogOut size={18} />,
    },
  ];

  return (
    <aside className="w-64 h-screen bg-white shadow-lg rounded-r-3xl px-6 py-8 flex flex-col">
      {/* Logo */}
      <h1 className="text-3xl font-bold mb-8 select-none cursor-default">
        <span className="text-[#ff7b00]">Stage</span>
        <span className="text-[#000041]">Flow</span>
      </h1>

      {/* Navigation */}
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

      {/* Footer (optionnel) */}
      <div className="text-xs text-gray-400 text-center mt-6 select-none">
        © {new Date().getFullYear()} StageFlow
      </div>
    </aside>
  );
}
