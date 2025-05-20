import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
   Send,
    Briefcase,
     ClipboardList,
  HelpCircle,
  UserCircle,
  KeyRound,
  LogOut,
  Heart,
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";

export default function SidebarEtudiant() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Se déconnecter ?',
      text: "Vous êtes sur le point de vous déconnecter.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, déconnecter',
      cancelButtonText: 'Annuler',
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://192.168.219.93:5000/api/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.removeItem('token');
        toast.success("Déconnexion réussie");
        navigate("/connexion");
      } catch (error) {
        console.error("Erreur lors de la déconnexion :", error);
        toast.error("Erreur lors de la déconnexion");
      }
    }
  };

  const navLinks = [
  {
    to: "/etudiant",
    label: "Liste des offres",
    icon: <LayoutDashboard size={18} />,
  },
  {
    to: "/etudiant/mescandidatures",
    label: "Mes candidatures",
    icon: <Send size={18} />,
  },
  {
    to: "/etudiant/messtages",
    label: "Mes stages",
    icon: <Briefcase size={18} />,
  },
  {
    to: "/etudiant/mesfavoris",
    label: "Mes favoris",
    icon: <Heart size={18} />,
  },
  {
    to: "/etudiant/mesevaluations",
    label: "Mes évaluations",
    icon: <ClipboardList size={18} />,
  },
  {
    to: "/etudiant/aide",
    label: "Conditions & Aide",
    icon: <HelpCircle size={18} />,
  },
  
  {
    to: "/etudiant/profiletudiant",
    label: "Mon profil",
    icon: <UserCircle size={18} />,
  },
  {
    to: "/etudiant/modifier-mot-de-passe",
    label: "Changer mot de passe",
    icon: <KeyRound size={18} />,
  },
];


  return (
  <aside className="w-64 h-screen bg-white shadow-lg rounded-r-3xl px-6 py-8 flex flex-col fixed top-0 left-0 z-50">
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

      {/* Bouton déconnexion */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-[#ff7b00]/20 transition-colors"
      >
        <LogOut size={18} />
        Déconnexion
      </button>
    </nav>

    {/* Footer */}
    <div className="text-xs text-gray-400 text-center mt-6 select-none">
      © {new Date().getFullYear()} StageFlow
    </div>
  </aside>
);

}
