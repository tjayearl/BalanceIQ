import { useState, useEffect, useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";
import { storage } from "../utils/storage";
import api from "../api";
import { FiPlus, FiTrash2, FiDollarSign, FiTag, FiCalendar, FiLoader, FiX } from "react-icons/fi";
import "./Expenses.css";

const CATEGORIES = ["Food","Transport","Housing","Entertainment","Health","Shopping","Utilities","Other"];
const CAT_COLOR  = { Food:"#10b981", Transport:"#3b82f6", Housing:"#f59e0b", Entertainment:"#8b5cf6", Health:"#ef4444", Shopping:"#ec4899", Utilities:"#06b6d4", Other:"#64748b" };
const BLANK = { title:"", amount:"", category:"Food", date: new Date().toISOString().split("T")[0], notes:"" };

export default function Expenses() {
  const { expenses, addExpense, deleteExpense } = useContext(FinanceContext);
  const [items, setItems] = useState(expenses);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    setItems(expenses);
  }, [expenses]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) { setError("Enter a valid amount."); return; }
    setSaving(true); setError("");

    const newExpense = { 
      id: Date.now(), // Generate unique ID
      ...form, 
      amount: parseFloat(form.amount),
      date: form.date || new Date().toISOString().split('T')[0]
    };

    try {
      await api.post("/transactions", newExpense);
    } catch {
      // API failed, but still add locally
    }
    addExpense(newExpense);
    setShowForm(false); 
    setForm(BLANK);
    setSaving(false);
  };

  const handleDelete = async id => {
    try { await api.delete(`/transactions/${id}`); } catch { /* ignore */ }
    deleteExpense(id);
  };

  const safeItems = Array.isArray(items) ? items : [];
  const visible   = filter === "All" ? safeItems : safeItems.filter(e => e.category === filter);
  const total     = visible.reduce((s,e) => s + Number(e.amount), 0);

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Expenses</h1>
          <p className="page__sub">{visible.length} transaction{visible.length !== 1 ? "s" : ""} · Total: <strong>${total.toFixed(2)}</strong></p>
        </div>
        <button className="btn btn--primary" onClick={() => { setShowForm(true); setError(""); setForm(BLANK); }}>
          <FiPlus /> Add Expense
        </button>
      </div>

      <div className="chips">
        {["All", ...CATEGORIES].map(c => (
          <button key={c} className={`chip ${filter === c ? "chip--active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>

      {showForm && (
        <div className="modal-bg" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__head">
              <h2 className="modal__title">New Expense</h2>
              <button className="btn-icon btn-icon--ghost" onClick={() => setShowForm(false)}><FiX /></button>
            </div>
            {error && <div className="form-error">{error}</div>}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Title</label>
                <div className="input-wrap"><FiTag className="input-icon" /><input className="form-input" placeholder="e.g. Grocery Run" value={form.title} onChange={e => set("title", e.target.value)} /></div>
              </div>
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <div className="input-wrap"><FiDollarSign className="input-icon" /><input className="form-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.amount} onChange={e => set("amount", e.target.value)} /></div>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e => set("category", e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Date</label>
                <div className="input-wrap"><FiCalendar className="input-icon" /><input className="form-input" type="date" value={form.date} onChange={e => set("date", e.target.value)} /></div>
              </div>
              <div className="form-group form-group--full">
                <label className="form-label">Notes <span className="form-hint">(optional)</span></label>
                <textarea className="form-textarea" rows={2} value={form.notes} onChange={e => set("notes", e.target.value)} />
              </div>
            </div>
            <div className="modal__footer">
              <button className="btn btn--secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn--primary" onClick={handleAdd} disabled={saving}>
                {saving ? <><FiLoader className="spin" /> Saving…</> : "Add Expense"}
              </button>
            </div>
          </div>
        </div>
      )}

      {visible.length === 0 ? (
        <div className="empty"><FiDollarSign className="empty__icon" /><p>No expenses found.</p></div>
      ) : (
        <div className="expense-list">
          {visible.map(e => (
            <div key={e.id} className="expense-item">
              <span className="expense-item__dot" style={{ background: CAT_COLOR[e.category] || "#64748b" }} />
              <div className="expense-item__info">
                <span className="expense-item__title">{e.title}</span>
                <span className="expense-item__meta">{e.category} · {e.date}</span>
                {e.notes && <span className="expense-item__notes">{e.notes}</span>}
              </div>
              <span className="expense-item__amount">-${Number(e.amount).toFixed(2)}</span>
              <button className="btn-icon btn-icon--danger" onClick={() => handleDelete(e.id)}><FiTrash2 /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}