import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarChef from "./SidebarChef.jsx";
import TopbarChef from "./TopbarChef.jsx";

export default function DashboardChefLayout() {
  const [search, setSearch] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(3);

  return (
    <div className="min-h-screen bg-gray-100">
      <SidebarChef />
      <div className="ml-64 flex flex-col min-h-screen"> {/* <-- Ajout de ml-64 */}
        <TopbarChef
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
