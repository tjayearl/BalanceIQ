import { useState, useEffect } from "react";
import api from "../api";

const EMPTY_DEBT_FORM = {
  name: "",
  lender: "",
  amount: "",
  dueDate: "",
  interestRate: "",
  notes: ""
};

export default function Debts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_DEBT_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      setLoading(true);
      const r = await api.get("/debts");
      const data = Array.isArray(r.data) ? r.data : (r.data?.data ?? r.data?.debts ?? []);
      setItems(data);
    } catch (e) {
      console.error("Failed to load debts:", e);
      setError(e.message || "Failed to load debts");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.name.trim()) { setError("Debt name is required."); return; }
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) { 
      setError("Enter a valid amount."); 
      return; 
    }
    
    setSaving(true);
    setError("");
    
    const newDebt = { 
      ...form, 
      amount: parseFloat(form.amount), 
      interestRate: parseFloat(form.interestRate) || 0
    };
    
    try {
      const r = await api.post("/debts", newDebt);
      setItems([r.data, ...items]);
      setShowForm(false);
      setForm(EMPTY_DEBT_FORM);
    } catch (e) {
      console.error("Failed to add debt:", e);
      setError(e.message || "Failed to add debt");
    } finally {
      setSaving(false);
    }
  };

  const handlePaid = async (id, paid) => {
    try {
      await api.patch(`/debts/${id}`, { paid });
      setItems(items.map(d => d.id === id ? { ...d, paid } : d));
    } catch (e) {
      console.error("Failed to update debt:", e);
      setError(e.message || "Failed to update debt");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this debt?")) return;
    
    try {
      await api.delete(`/debts/${id}`);
      setItems(items.filter(d => d.id !== id));
    } catch (e) {
      console.error("Failed to delete debt:", e);
      setError(e.message || "Failed to delete debt");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Loading debts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Debts</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            {showForm ? "Cancel" : "+ Add Debt"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Debt</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Debt Name"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="Lender (optional)"
                value={form.lender}
                onChange={e => setForm({...form, lender: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={e => setForm({...form, amount: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Interest Rate (%)"
                value={form.interestRate}
                onChange={e => setForm({...form, interestRate: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="date"
                placeholder="Due Date"
                value={form.dueDate}
                onChange={e => setForm({...form, dueDate: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
            </div>
            <textarea
              placeholder="Notes (optional)"
              value={form.notes}
              onChange={e => setForm({...form, notes: e.target.value})}
              className="w-full px-4 py-2 border rounded-lg mt-4"
              rows="2"
            />
            <button
              onClick={handleAdd}
              disabled={saving}
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Debt"}
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">No debts tracked</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Add Your First Debt
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(debt => (
              <div key={debt.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{debt.name}</h3>
                    {debt.lender && <p className="text-gray-600">Lender: {debt.lender}</p>}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${debt.paid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {debt.paid ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-gray-600 text-sm">Amount</p>
                    <p className="font-semibold text-lg">${parseFloat(debt.amount).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Interest Rate</p>
                    <p className="font-semibold">{debt.interestRate || 0}%</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Due Date</p>
                    <p className="font-semibold">{debt.dueDate || 'N/A'}</p>
                  </div>
                </div>
                {debt.notes && (
                  <p className="text-gray-600 text-sm mb-4">Notes: {debt.notes}</p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePaid(debt.id, !debt.paid)}
                    className={`px-4 py-2 rounded-lg ${debt.paid ? 'bg-gray-200 text-gray-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                  >
                    {debt.paid ? 'Mark Unpaid' : 'Mark Paid'}
                  </button>
                  <button
                    onClick={() => handleDelete(debt.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
