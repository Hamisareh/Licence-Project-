import React from "react";
import { Search } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

export default function TopbarChef({ search, setSearch }) {
  return (
    <header className="bg-white shadow p-4 mx-8 mt-8 rounded-2xl flex items-center justify-between sticky top-0 z-10">
      {/* Barre de recherche */}
      <div className="relative max-w-md w-full">
        <input
          type="text"
          placeholder="Recherche..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      {/* Notifications + badge utilisateur */}
      <div className="flex items-center gap-6">
        <NotificationDropdown />

        <div className="bg-secondary text-white rounded-full px-4 py-1 font-semibold select-none">
          Chef de Département
        </div>
      </div>
    </header>
  );
}
