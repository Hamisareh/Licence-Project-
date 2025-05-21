// DashboardAdminLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarAdmin from "./SidebarAdmin";
import TopbarAdmin from "./TopbarAdmin";

export default function DashboardAdminLayout() {
  const [search, setSearch] = useState("");
  const [notificationsCount, setNotificationsCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100">
      <SidebarAdmin />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopbarAdmin
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