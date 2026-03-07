import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { FiDollarSign, FiTrendingDown, FiAlertCircle, FiCheckCircle, FiArrowRight, FiLoader } from "react-icons/fi";
import "./Dashboard.css";

const PIE_COLORS = ["#2563eb","#10b981","#f59e0b","#8b5cf6","#ef4444","#ec4899","#06b6d4","#64748b"];

const MOCK_EXPENSES = [
  { id:1, title:"Monthly Rent",  amount:1200,  category:"Housing",       date:"2026-03-01" },
  { id:2, title:"Bus Pass",      amount:45,    category:"Transport",     date:"2026-03-02" },
  { id:3, title:"Netflix",       amount:15.99, category:"Entertainment", date:"2026-03-03" },
  { id:4, title:"Grocery Run",   amount:85.40, category:"Food",          date:"2026-03-04" },
  { id:5, title:"Doctor Visit",  amount:120,   category:"Health",        date:"2026-02-28" },
  { id:6, title:"Amazon Order",  amount:67.50, category:"Shopping",      date:"2026-02-25" },
  { id:7, title:"Electricity",   amount:95,    category:"Utilities",     date:"2026-02-20" },
  { id:8, title:"Dinner Out",    amount:52,    category:"Food",          date:"2026-02-18" },
];

const MOCK_DEBTS = [
  { id:1, name:"Car Loan",      lender:"Bank of America", amount:8500,  dueDate:"2026-12-01", paid:false },
  { id:2, name:"Credit Card",   lender:"Chase",           amount:2300,  dueDate:"2026-04-01", paid:false },
  { id:3, name:"Student Loan",  lender:"Sallie Mae",      amount:15000, dueDate:"2030-06-01", paid:false },
  { id:4, name:"Personal Loan", lender:"Friend - Mike",   amount:500,   dueDate:"2026-02-15", paid:true  },
];

const TREND = [
  { month:"Oct", spending:980,  budget:1300 },
  { month:"Nov", spending:1150, budget:1300 },
  { month:"Dec", spending:1420, budget:1300 },
  { month:"Jan", spending:1100, budget:1300 },
  { month:"Feb", spending:1280, budget:1300 },
  { month:"Mar", spending:1486, budget:1300 },
];

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [debts,    setDebts]    = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [e, d] = await Promise.all([
          api.get("/transactions"),
          api.get("/debts"),
        ]);
        const expData = Array.isArray(e.data) ? e.data : (e.data?.data ?? e.data?.expenses ?? []);
        const debtData = Array.isArray(d.data) ? d.data : (d.data?.data ?? d.data?.debts ?? []);
        setExpenses(expData); setDebts(debtData);
      } catch {
        setExpenses(MOCK_EXPENSES); setDebts(MOCK_DEBTS);
      } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div className="loading"><FiLoader className="spin" /> Loading…</div>;

  const safeExpenses  = Array.isArray(expenses) ? expenses : [];
  const safeDebts     = Array.isArray(debts) ? debts : [];
  const totalExpenses = safeExpenses.reduce((s,e) => s + Number(e.amount), 0);
  const totalDebt     = safeDebts.filter(d => !d.paid).reduce((s,d) => s + Number(d.amount), 0);
  const overdueCount  = safeDebts.filter(d => !d.paid && d.dueDate && new Date(d.dueDate) < new Date()).length;
  const paidCount     = safeDebts.filter(d => d.paid).length;

  const catMap = {};
  safeExpenses.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + Number(e.amount); });
  const pieData = Object.entries(catMap).map(([name, value]) => ({ name, value: +value.toFixed(2) }));

  const recent      = [...safeExpenses].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  const activeDebts = safeDebts.filter(d => !d.paid).slice(0, 5);
  const isOverdue   = d => !d.paid && d.dueDate && new Date(d.dueDate) < new Date();

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Dashboard</h1>
          <p className="page__sub">Your financial snapshot</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--blue"><FiDollarSign /></div>
          <span className="stat-card__label">Monthly Expenses</span>
          <span className="stat-card__value">${totalExpenses.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--red"><FiTrendingDown /></div>
          <span className="stat-card__label">Total Debt</span>
          <span className="stat-card__value c-danger">${totalDebt.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--yellow"><FiAlertCircle /></div>
          <span className="stat-card__label">Overdue Debts</span>
          <span className="stat-card__value c-warning">{overdueCount}</span>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--green"><FiCheckCircle /></div>
          <span className="stat-card__label">Debts Cleared</span>
          <span className="stat-card__value c-success">{paidCount}</span>
        </div>
      </div>

      <div className="dash-charts">
        <div className="card">
          <p className="card__title">Monthly Spending Trend</p>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={TREND} margin={{ top:4, right:8, left:-10, bottom:0 }}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize:12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={v => [`$${v}`, ""]} />
              <Area type="monotone" dataKey="spending" stroke="#2563eb" strokeWidth={2} fill="url(#grad)" name="Spending" />
              <Area type="monotone" dataKey="budget"   stroke="#e2e8f0" strokeWidth={1.5} strokeDasharray="5 5" fill="none" name="Budget" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <p className="card__title">Expenses by Category</p>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="45%" innerRadius={52} outerRadius={78} dataKey="value" paddingAngle={2}>
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={v => [`$${v}`, ""]} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize:"0.75rem" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dash-bottom">
        <div className="card">
          <div className="card__row">
            <p className="card__title" style={{ margin:0 }}>Recent Expenses</p>
            <Link to="/dashboard/expenses" className="dash-link">All <FiArrowRight /></Link>
          </div>
          {recent.length === 0
            ? <p className="c-muted" style={{ fontSize:"0.875rem" }}>No expenses yet.</p>
            : recent.map(e => (
              <div key={e.id} className="dash-row">
                <span className="dash-row__dot" style={{ background: PIE_COLORS[Object.keys(catMap).indexOf(e.category) % PIE_COLORS.length] }} />
                <span className="dash-row__title">{e.title}</span>
                <span className="dash-row__cat">{e.category}</span>
                <span className="dash-row__amount c-danger">-${Number(e.amount).toFixed(2)}</span>
              </div>
            ))
          }
        </div>

        <div className="card">
          <div className="card__row">
            <p className="card__title" style={{ margin:0 }}>Active Debts</p>
            <Link to="/dashboard/debts" className="dash-link">All <FiArrowRight /></Link>
          </div>
          {activeDebts.length === 0
            ? <p className="c-muted" style={{ fontSize:"0.875rem" }}>No active debts 🎉</p>
            : activeDebts.map(d => (
              <div key={d.id} className="dash-row">
                <span className="dash-row__title">{d.name}</span>
                {isOverdue(d) && <span className="badge badge--danger">Overdue</span>}
                <span className="dash-row__amount c-danger" style={{ marginLeft:"auto" }}>${Number(d.amount).toLocaleString()}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}