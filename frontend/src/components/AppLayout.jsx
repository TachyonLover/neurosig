import { Outlet } from "react-router";
import { useState } from "react";
import Sidebar from "./Sidebar";

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <div className={`app-layout ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((prev) => !prev)}
        />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;