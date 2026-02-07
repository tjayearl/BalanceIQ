import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Debts from "./pages/Debts";
import Expenses from "./pages/Expenses";
import Taxes from "./pages/Taxes";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Debts />} />
        <Route path="debts" element={<Debts />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="taxes" element={<Taxes />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;