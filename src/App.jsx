import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import Landing from "./pages/Landing";
import Debts from "./pages/Debts";
import Expenses from "./pages/Expenses";
import Taxes from "./pages/Taxes";
import TaxCalculator from "./pages/TaxCalculator";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="debts" element={<Debts />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="taxes" element={<Taxes />} />
        <Route path="tax-calculator" element={<TaxCalculator />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;