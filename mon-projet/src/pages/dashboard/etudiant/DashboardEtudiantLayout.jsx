import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarEtudiant from "./SidebarEtudiant.jsx";
import TopbarEtudiant from "./TopbarEtudiant.jsx";

export default function DashboardEtudiantLayout() {
  const [search, setSearch] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(3);

  return (
    <div className="min-h-screen bg-gray-100">
      <SidebarEtudiant />
      <div className="ml-64 flex flex-col min-h-screen"> {/* <-- Ajout de ml-64 */}
        <TopbarEtudiant
          search={search}
          setSearch={setSearch}
          notificationsCount={notificationsCount}
        />
        <main className="p-6 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
