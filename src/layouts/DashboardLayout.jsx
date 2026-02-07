import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import "./DashboardLayout.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="dashboard">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <AiOutlineMenu />
      </button>

      <div className="main-content-wrapper">
        <Header />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;