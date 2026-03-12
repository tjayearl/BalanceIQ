import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userPrefs, setUserPrefs] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user preferences from onboarding
    const onboardingData = localStorage.getItem('balanceiq_onboarding');
    if (onboardingData) {
      try {
        const prefs = JSON.parse(onboardingData);
        // defer state update to avoid cascading render warning
        setTimeout(() => setUserPrefs(prefs), 0);
      } catch (e) {
        console.error('Failed to load user preferences:', e);
      }
    }

    // Load expenses from localStorage (NO API CALLS)
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      try {
        const ex = JSON.parse(storedExpenses);
        setTimeout(() => setExpenses(ex), 0);
      } catch (e) {
        console.error('Failed to load expenses:', e);
        setTimeout(() => setExpenses([]), 0);
      }
    } else {
      setTimeout(() => setExpenses([]), 0);
    }

    // Load debts from localStorage (NO API CALLS)
    const storedDebts = localStorage.getItem('debts');
    if (storedDebts) {
      try {
        const db = JSON.parse(storedDebts);
        setTimeout(() => setDebts(db), 0);
      } catch (e) {
        console.error('Failed to load debts:', e);
        setTimeout(() => setDebts([]), 0);
      }
    } else {
      setTimeout(() => setDebts([]), 0);
    }

    setTimeout(() => setLoading(false), 0);
  }, []);

  const currencySymbol = userPrefs?.currency === 'KES' ? 'KSh' : '$';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            {userPrefs && (
              <p className="text-gray-600 mt-1">
                Work Type: {userPrefs.workType} • Currency: {userPrefs.currency}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("balanceiq_onboarding");
              navigate("/login");
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Expenses */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Expenses</h3>
            <p className="text-3xl font-bold text-red-600">
              {currencySymbol} {totalExpenses.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">{expenses.length} transactions</p>
          </div>

          {/* Total Debts */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Outstanding Debts</h3>
            <p className="text-3xl font-bold text-orange-600">
              {currencySymbol} {totalDebts.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">{debts.filter(d => !d.paid).length} unpaid</p>
          </div>

          {/* Net Balance */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Net Impact</h3>
            <p className="text-3xl font-bold text-blue-600">
              {currencySymbol} {(totalExpenses + totalDebts).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">Expenses + Debts</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Expenses Section */}
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
                      <p className="font-medium text-gray-800">{expense.title || expense.description}</p>
                      <p className="text-sm text-gray-500">{expense.category}</p>
                    </div>
                    <p className="font-semibold text-red-600">
                      {currencySymbol} {parseFloat(expense.amount).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Debts Section */}
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
                  Add Debt
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {debts.filter(d => !d.paid).slice(0, 3).map(debt => (
                  <div key={debt.id} className="flex justify-between items-center border-b pb-3">
                    <div>
                      <p className="font-medium text-gray-800">{debt.name}</p>
                      <p className="text-sm text-gray-500">Due: {debt.dueDate || 'No date'}</p>
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
