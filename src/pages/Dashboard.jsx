import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FinanceContext } from "../context/FinanceContext";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const { expenses: allExpenses, debts: allDebts } = useContext(FinanceContext);
  const [userPrefs, setUserPrefs] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter to only onboarding data
  const expenses = allExpenses.filter(e => e.notes === "From onboarding setup");
  const debts = allDebts.filter(d => d.notes === "From onboarding setup");

  useEffect(() => {
    // Load user preferences from onboarding
    const onboardingData = localStorage.getItem('balanceiq_onboarding');
    if (onboardingData) {
      try {
        const prefs = JSON.parse(onboardingData);
        setUserPrefs(prefs);
      } catch (e) {
        console.error('Failed to load user preferences:', e);
      }
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
      <div className="dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#64748b' }}>Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Dashboard</h1>
          {userPrefs && (
            <p className="dashboard__sub">
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
          className="dashboard__logout"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {/* Total Expenses */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--red">💸</div>
          <div className="stat-card__label">Total Expenses</div>
          <div className="stat-card__value" style={{ color: '#ef4444' }}>
            {currencySymbol} {totalExpenses.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>{expenses.length} transactions</div>
        </div>

        {/* Total Debts */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--yellow">💳</div>
          <div className="stat-card__label">Outstanding Debts</div>
          <div className="stat-card__value" style={{ color: '#f59e0b' }}>
            {currencySymbol} {totalDebts.toFixed(2)}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>{debts.filter(d => !d.paid).length} unpaid</div>
        </div>

        {/* Net Balance */}
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue">⚖️</div>
          <div className="stat-card__label">Net Impact</div>
          <div className="stat-card__value" style={{ color: '#2563eb' }}>
            {currencySymbol} {(totalExpenses + totalDebts).toFixed(2)}
          </div>
          <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.5rem' }}>Expenses + Debts</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="sections">
        {/* Expenses Section */}
        <div className="section">
          <div className="section__header">
            <h2 className="section__title">Recent Expenses</h2>
            <button
              onClick={() => navigate("/dashboard/expenses")}
              className="section__link"
            >
              View All →
            </button>
          </div>
          {expenses.length === 0 ? (
            <div className="section__empty">
              <p>No expenses yet</p>
              <button
                onClick={() => navigate("/dashboard/expenses")}
                className="section__add-btn"
              >
                Add First Expense
              </button>
            </div>
          ) : (
            <div>
              {expenses.slice(0, 3).map(expense => (
                <div key={expense.id} className="expense-item">
                  <div className="expense-item__info">
                    <h4>{expense.title || expense.description}</h4>
                    <div className="expense-item__category">{expense.category}</div>
                  </div>
                  <div className="expense-item__amount">
                    {currencySymbol} {parseFloat(expense.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Debts Section */}
        <div className="section">
          <div className="section__header">
            <h2 className="section__title">Active Debts</h2>
            <button
              onClick={() => navigate("/dashboard/debts")}
              className="section__link"
            >
              View All →
            </button>
          </div>
          {debts.filter(d => !d.paid).length === 0 ? (
            <div className="section__empty">
              <p>No active debts</p>
              <button
                onClick={() => navigate("/dashboard/debts")}
                className="section__add-btn"
              >
                Add Debt
              </button>
            </div>
          ) : (
            <div>
              {debts.filter(d => !d.paid).slice(0, 3).map(debt => (
                <div key={debt.id} className="debt-item">
                  <div className="debt-item__info">
                    <h4>{debt.name}</h4>
                    <div className="expense-item__category">Due: {debt.dueDate || 'No date'}</div>
                  </div>
                  <div className="debt-item__amount">
                    {currencySymbol} {parseFloat(debt.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
