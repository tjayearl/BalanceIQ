import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login    from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Debts from "./pages/Debts";
import TaxCalculator from "./pages/TaxCalculator";
import Settings from "./pages/Settings";

import "./index.css";

// the MetaMask inpage script can reject a promise when the extension is not
// installed; the default error shows up in the console and might confuse users
// during onboarding.  we catch and ignore it globally so the rest of the app keeps
// running normally.
window.addEventListener("unhandledrejection", e => {
  const msg = e.reason && e.reason.message;
  if (typeof msg === "string" && msg.includes("MetaMask extension not found")) {
    console.warn("detected missing MetaMask extension, ignoring connection attempt");
    e.preventDefault(); // suppress console error
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="debts" element={<Debts />} />
          <Route path="taxes" element={<TaxCalculator />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);