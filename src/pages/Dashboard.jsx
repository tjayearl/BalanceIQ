import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Debts from "./Debts";
import Expenses from "./Expenses";
import Taxes from "./Taxes";
import Settings from "./Settings";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/dashboard/debts" style={{ margin: "0 10px" }}>Debts</Link>
        <Link to="/dashboard/expenses" style={{ margin: "0 10px" }}>Expenses</Link>
        <Link to="/dashboard/taxes" style={{ margin: "0 10px" }}>Taxes</Link>
        <Link to="/dashboard/settings" style={{ margin: "0 10px" }}>Settings</Link>
      </nav>

      <Routes>
        <Route path="/dashboard/debts" element={<Debts />} />
        <Route path="/dashboard/expenses" element={<Expenses />} />
        <Route path="/dashboard/taxes" element={<Taxes />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default Dashboard;