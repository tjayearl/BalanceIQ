import { useState, useEffect } from "react";
import axios from "axios";
import { FiPlus, FiTrash2, FiCheckCircle, FiAlertCircle, FiDollarSign, FiCalendar, FiUser, FiLoader, FiX, FiRotateCcw } from "react-icons/fi";
import "./Debts.css";

const MOCK = [
  { id:1, name:"Car Loan",      lender:"Bank of America", amount:8500,  dueDate:"2026-12-01", interestRate:4.5,  paid:false, notes:"Monthly: $210" },
  { id:2, name:"Credit Card",   lender:"Chase",           amount:2300,  dueDate:"2026-04-01", interestRate:19.9, paid:false, notes:"" },
  { id:3, name:"Student Loan",  lender:"Sallie Mae",      amount:15000, dueDate:"2030-06-01", interestRate:5.0,  paid:false, notes:"Income-driven repayment" },
  { id:4, name:"Personal Loan", lender:"Friend — Mike",   amount:500,   dueDate:"2026-02-15", interestRate:0,    paid:true,  notes:"Paid back in full" },
];
const BLANK = { name:"", lender:"", amount:"", dueDate:"", interestRate:"", notes:"" };
const isOverdue = d => !d.paid && d.dueDate && new Date(d.dueDate) < new Date();

export default function Debts() {
  const [items,    setItems]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(BLANK);
  const [error,    setError]    = useState("");
  const [saving,   setSaving]   = useState(false);
  const [filter,   setFilter]   = useState("all");

  useEffect(() => {
    axios.get("/api/debts")
      .then(r => {
        const data = Array.isArray(r.data) ? r.data : (r.data?.data ?? r.data?.debts ?? []);
        setItems(data);
      })
      .catch(() => setItems(MOCK))
      .finally(() => setLoading(false));
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAdd = async () => {
    if (!form.name.trim())                               { setError("Debt name is required."); return; }
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) { setError("Enter a valid amount."); return; }
    setSaving(true); setError("");
    const payload = { ...form, amount: parseFloat(form.amount), interestRate: parseFloat(form.interestRate) || 0, paid: false };
    try   { const r = await axios.post("/api/debts", payload); setItems(p => [r.data, ...p]); }
    catch { setItems(p => [{ id: Date.now(), ...payload }, ...p]); }
    finally { setSaving(false); setShowForm(false); setForm(BLANK); }
  };

  const handlePaid = async (id, paid) => {
    try { await axios.patch(`/api/debts/${id}`, { paid }); } catch {}
    setItems(p => p.map(d => d.id === id ? { ...d, paid } : d));
  };

  const handleDelete = async id => {
    try { await axios.delete(`/api/debts/${id}`); } catch {}
    setItems(p => p.filter(d => d.id !== id));
  };

  const safeItems  = Array.isArray(items) ? items : [];
  const visible    = safeItems.filter(d => filter === "paid" ? d.paid : filter === "unpaid" ? !d.paid : true);
  const totalOwed  = safeItems.filter(d => !d.paid).reduce((s,d) => s + Number(d.amount), 0);
  const totalPaid  = safeItems.filter(d =>  d.paid).reduce((s,d) => s + Number(d.amount), 0);

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Debt Management</h1>
          <p className="page__sub">Owed: <strong className="c-danger">${totalOwed.toLocaleString()}</strong> · Cleared: <strong className="c-success">${totalPaid.toLocaleString()}</strong></p>
        </div>
        <button className="btn btn--primary" onClick={() => { setShowForm(true); setError(""); setForm(BLANK); }}>
          <FiPlus /> Add Debt
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><span className="stat-card__label">Active Debts</span><span className="stat-card__value c-danger">{safeItems.filter(d => !d.paid).length}</span></div>
        <div className="stat-card"><span className="stat-card__label">Total Balance</span><span className="stat-card__value c-danger">${totalOwed.toLocaleString()}</span></div>
        <div className="stat-card"><span className="stat-card__label">Overdue</span><span className="stat-card__value c-warning">{safeItems.filter(isOverdue).length}</span></div>
        <div className="stat-card"><span className="stat-card__label">Debts Cleared</span><span className="stat-card__value c-success">{safeItems.filter(d => d.paid).length}</span></div>
      </div>

      <div className="chips">
        {[["all","All"],["unpaid","Unpaid"],["paid","Paid"]].map(([v,l]) => (
          <button key={v} className={`chip ${filter === v ? "chip--active" : ""}`} onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      {showForm && (
        <div className="modal-bg" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__head">
              <h2 className="modal__title">Add Debt</h2>
              <button className="btn-icon btn-icon--ghost" onClick={() => setShowForm(false)}><FiX /></button>
            </div>
            {error && <div className="form-error">{error}</div>}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Debt Name</label>
                <div className="input-wrap"><FiUser className="input-icon" /><input className="form-input" placeholder="e.g. Car Loan" value={form.name} onChange={e => set("name", e.target.value)} /></div>
              </div>
              <div className="form-group">
                <label className="form-label">Lender</label>
                <div className="input-wrap"><FiUser className="input-icon" /><input className="form-input" placeholder="e.g. Bank of America" value={form.lender} onChange={e => set("lender", e.target.value)} /></div>
              </div>
              <div className="form-group">
                <label className="form-label">Balance ($)</label>
                <div className="input-wrap"><FiDollarSign className="input-icon" /><input className="form-input" type="number" min="0" placeholder="0.00" value={form.amount} onChange={e => set("amount", e.target.value)} /></div>
              </div>
              <div className="form-group">
                <label className="form-label">Interest Rate (%) <span className="form-hint">optional</span></label>
                <input className="form-input" type="number" min="0" step="0.1" placeholder="0.00" value={form.interestRate} onChange={e => set("interestRate", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date <span className="form-hint">optional</span></label>
                <div className="input-wrap"><FiCalendar className="input-icon" /><input className="form-input" type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} /></div>
              </div>
              <div className="form-group form-group--full">
                <label className="form-label">Notes <span className="form-hint">optional</span></label>
                <textarea className="form-textarea" rows={2} value={form.notes} onChange={e => set("notes", e.target.value)} />
              </div>
            </div>
            <div className="modal__footer">
              <button className="btn btn--secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="btn btn--primary" onClick={handleAdd} disabled={saving}>
                {saving ? <><FiLoader className="spin" /> Saving…</> : "Add Debt"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading"><FiLoader className="spin" /> Loading…</div>
      ) : visible.length === 0 ? (
        <div className="empty"><FiDollarSign className="empty__icon" /><p>No debts found.</p></div>
      ) : (
        <div className="debt-list">
          {visible.map(d => (
            <div key={d.id} className={`debt-card ${d.paid ? "debt-card--paid" : ""} ${isOverdue(d) ? "debt-card--overdue" : ""}`}>
              <div className="debt-card__header">
                <div className="debt-card__name-wrap">
                  <span className="debt-card__name">{d.name}</span>
                  {d.lender && <span className="debt-card__lender">{d.lender}</span>}
                </div>
                <div className="debt-card__badges">
                  {d.paid       && <span className="badge badge--success"><FiCheckCircle /> Paid</span>}
                  {isOverdue(d) && <span className="badge badge--danger"><FiAlertCircle /> Overdue</span>}
                  {!d.paid && d.interestRate > 0 && <span className="badge badge--neutral">{d.interestRate}% APR</span>}
                </div>
              </div>
              <div className="debt-card__meta">
                <span className={`debt-card__amount ${d.paid ? "c-success" : "c-danger"}`}>${Number(d.amount).toLocaleString()}</span>
                {d.dueDate && <span className="debt-card__due"><FiCalendar /> Due {d.dueDate}</span>}
              </div>
              {d.notes && <p className="debt-card__notes">{d.notes}</p>}
              <div className="debt-card__actions">
                {!d.paid
                  ? <button className="btn btn--success btn--sm" onClick={() => handlePaid(d.id, true)}><FiCheckCircle /> Mark as Paid</button>
                  : <button className="btn btn--secondary btn--sm" onClick={() => handlePaid(d.id, false)}><FiRotateCcw /> Undo Paid</button>
                }
                <button className="btn-icon btn-icon--danger" onClick={() => handleDelete(d.id)}><FiTrash2 /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}