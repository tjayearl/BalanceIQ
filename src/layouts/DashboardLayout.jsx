import { Link, Outlet } from "react-router-dom";
import "./DashboardLayout.css";
import AppHeader from "../components/AppHeader";

function DashboardLayout() {
  return (
    <div className="dashboard">
      <aside className="sidebar">
        <AppHeader />
        <nav>
          <Link to="/dashboard/debts">Debts</Link>
          <Link to="/dashboard/expenses">Expenses</Link>
          <Link to="/dashboard/taxes">Taxes</Link>
          <Link to="/dashboard/settings">Settings</Link>
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;