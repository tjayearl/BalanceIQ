import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userPrefs, setUserPrefs] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile/preferences
      const profileRes = await api.get("/auth/profile");
      setUserPrefs(profileRes.data);
      
      // Fetch expenses (transactions)
      const expensesRes = await api.get("/transactions");
      setExpenses(Array.isArray(expensesRes.data) ? expensesRes.data : expensesRes.data?.data || []);
      
      // Fetch debts
      const debtsRes = await api.get("/debts");
      setDebts(Array.isArray(debtsRes.data) ? debtsRes.data : debtsRes.data?.data || []);
      
    } catch (e) {
      console.error("Failed to load dashboard data:", e);
      setError(e.message || "Failed to load data");
      
      // If unauthorized, redirect to login
      if (e.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const currencySymbol = userPrefs?.currency === 'KES' ? 'KSh' : 
                         userPrefs?.currency === 'USD' ? '$' : 
                         userPrefs?.currency || '$';

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const totalDebts = debts
    .filter(d => !d.paid)
    .reduce((sum, d) => sum + (parseFloat(d.amount) || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Loading your dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">BalanceIQ Dashboard</h1>
            {userPrefs && (
              <p className="text-gray-600 mt-1">
                {userPrefs.email} • {userPrefs.workType || 'Self-Employed'} • {userPrefs.currency || 'USD'}
              </p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Expenses</h3>
            <p className="text-3xl font-bold text-red-600">
              {currencySymbol} {totalExpenses.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">{expenses.length} transactions</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Outstanding Debts</h3>
            <p className="text-3xl font-bold text-orange-600">
              {currencySymbol} {totalDebts.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">{debts.filter(d => !d.paid).length} unpaid</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Net Impact</h3>
            <p className="text-3xl font-bold text-blue-600">
              {currencySymbol} {(totalExpenses + totalDebts).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Total obligations</p>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate("/dashboard/expenses")}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Expenses</h3>
            <p className="text-gray-600 text-sm">Track and manage your expenses</p>
          </button>

          <button
            onClick={() => navigate("/dashboard/debts")}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">💳 Debts</h3>
            <p className="text-gray-600 text-sm">Monitor and pay off debts</p>
          </button>

          <button
            onClick={() => navigate("/dashboard/tax-calculator")}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition text-left"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🧮 Tax Calculator</h3>
            <p className="text-gray-600 text-sm">Calculate taxes for your country</p>
          </button>
        </div>

        {/* Quick View Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Expenses */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Expenses</h2>
              <button
                onClick={() => navigate("/dashboard/expenses")}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                View All →
              </button>
            </div>
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No expenses yet</p>
                <button
                  onClick={() => navigate("/dashboard/expenses")}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Add First Expense
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.slice(0, 3).map(expense => (
                  <div key={expense.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium text-gray-800">
                        {expense.description || expense.title || expense.category}
                      </p>
                      <p className="text-sm text-gray-500">
                        {expense.category} • {expense.date || 'No date'}
                      </p>
                    </div>
                    <p className="font-semibold text-red-600">
                      {currencySymbol} {parseFloat(expense.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Debts */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Active Debts</h2>
              <button
                onClick={() => navigate("/dashboard/debts")}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                View All →
              </button>
            </div>
            {debts.filter(d => !d.paid).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No active debts</p>
                <button
                  onClick={() => navigate("/dashboard/debts")}
                  className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Track Debt
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {debts.filter(d => !d.paid).slice(0, 3).map(debt => (
                  <div key={debt.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium text-gray-800">{debt.name}</p>
                      <p className="text-sm text-gray-500">
                        {debt.lender ? `To: ${debt.lender}` : ''} • Due: {debt.dueDate || 'No date'}
                      </p>
                    </div>
                    <p className="font-semibold text-orange-600">
                      {currencySymbol} {parseFloat(debt.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
