import { Outlet } from "react-router-dom";
import "./DashboardLayout.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function DashboardLayout() {
  return (
    <div className="dashboard">
      <Sidebar />

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