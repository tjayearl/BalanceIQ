import React from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineHome, AiOutlineDollar, AiOutlineCreditCard, AiOutlineBank, AiOutlineSetting } from 'react-icons/ai';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-title">BalanceIQ</div>
      <nav>
        <NavLink to="/dashboard" end className={({ isActive }) => isActive ? "active" : ""}>
          <AiOutlineHome /> Dashboard
        </NavLink>
        <NavLink to="/dashboard/debts" className={({ isActive }) => isActive ? "active" : ""}>
          <AiOutlineCreditCard /> Debts
        </NavLink>
        <NavLink to="/dashboard/expenses" className={({ isActive }) => isActive ? "active" : ""}>
          <AiOutlineDollar /> Expenses
        </NavLink>
        <NavLink to="/dashboard/taxes" className={({ isActive }) => isActive ? "active" : ""}>
          <AiOutlineBank /> Taxes
        </NavLink>
        <NavLink to="/dashboard/settings" className={({ isActive }) => isActive ? "active" : ""}>
          <AiOutlineSetting /> Settings
        </NavLink>
      </nav>
    </aside>
  );
}

export default Sidebar;