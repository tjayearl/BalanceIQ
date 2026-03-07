import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FiGrid, FiDollarSign, FiCreditCard, FiFileText, FiSettings, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import "./DashboardLayout.css";

const NAV = [
  { to: "/dashboard",          label: "Dashboard",      icon: <FiGrid />,       exact: true },
  { to: "/dashboard/expenses", label: "Expenses",       icon: <FiDollarSign /> },
  { to: "/dashboard/debts",    label: "Debts",          icon: <FiCreditCard /> },
  { to: "/dashboard/taxes",    label: "Tax Calculator", icon: <FiFileText /> },
  { to: "/dashboard/settings", label: "Settings",       icon: <FiSettings /> },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const active = (to, exact) =>
    exact ? pathname === to : pathname.startsWith(to) && to !== "/dashboard";

  return (
    <div className="layout">
      {open && <div className="overlay" onClick={() => setOpen(false)} />}

      <aside className={`sidebar ${open ? "sidebar--open" : ""}`}>
        <div className="sidebar__top">
          <div className="sidebar__logo">
            <span className="sidebar__logo-icon">⚖️</span>
            <span className="sidebar__logo-text">BalanceIQ</span>
          </div>
          <button className="btn-icon sidebar__close" onClick={() => setOpen(false)}><FiX /></button>
        </div>

        <nav className="sidebar__nav">
          {NAV.map(({ to, label, icon, exact }) => (
            <Link
              key={to}
              to={to}
              className={`nav-link ${active(to, exact) ? "nav-link--active" : ""}`}
              onClick={() => setOpen(false)}
            >
              <span className="nav-link__icon">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        <div className="sidebar__bottom">
          <div className="sidebar__user">
            <div className="avatar">U</div>
            <div className="sidebar__user-info">
              <span className="sidebar__user-name">My Account</span>
              <span className="sidebar__user-sub">Personal</span>
            </div>
          </div>
          <button className="btn-icon sidebar__logout" onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}>
            <FiLogOut />
          </button>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button className="btn-icon topbar__menu" onClick={() => setOpen(true)}><FiMenu /></button>
          <span className="topbar__brand">⚖️ BalanceIQ</span>
          <div style={{ width: 36 }} />
        </header>
        <div className="page-wrap">
          <Outlet />
        </div>
      </div>
    </div>
  );
}