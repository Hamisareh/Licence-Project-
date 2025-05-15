import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarChef from "./SidebarChef.jsx";
import TopbarChef from "./TopbarChef.jsx";

export default function DashboardChefLayout() {
  const [search, setSearch] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(3);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SidebarChef />
      <div className="flex-1 flex flex-col">
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
