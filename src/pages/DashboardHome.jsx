import { useContext } from "react";
import { Link } from "react-router-dom";
import { FinanceContext } from "../context/FinanceContext";
import "./DashboardHome.css";

function DashboardHome() {
  const { expenses, debts } = useContext(FinanceContext);

  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalDebts = debts.reduce((sum, d) => sum + Number(d.remaining), 0);
  const balance = 0 - totalExpenses - totalDebts;

  return (
    <div>
        <h1 className="dashboard-title">Overview</h1>

        {/* Horizontal Cards */}
        <div className="horizontal-cards">
          <div className="card">
            <h3>Expenses</h3>
            <p className="amount">Ksh {totalExpenses.toFixed(2)}</p>
            <span className="hint">Money going out</span>
          </div>

          <div className="card">
            <h3>Debts</h3>
            <p className="amount debt">Ksh {totalDebts.toFixed(2)}</p>
            <span className="hint">What you owe</span>
          </div>

          <div className="card highlight">
            <h3>Balance</h3>
            <p className={`amount ${balance < 0 ? "negative" : "positive"}`}>
              Ksh {balance.toFixed(2)}
            </p>
            <span className="hint">Current position</span>
          </div>
        </div>

        {/* Call to Action */}
        {expenses.length === 0 && debts.length === 0 && (
          <div className="dashboard-actions">
            <Link to="/dashboard/expenses" className="btn primary">Add Expense</Link>
            <Link to="/dashboard/debts" className="btn secondary">Add Debt</Link>
          </div>
        )}
    </div>
  );
}

export default DashboardHome;