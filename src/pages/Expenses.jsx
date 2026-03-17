import { useState, useEffect } from "react";
import api from "../api";

const EMPTY_EXPENSE_FORM = {
  description: "",
  amount: "",
  category: "Food",
  date: new Date().toISOString().split('T')[0],
  notes: ""
};

export default function Expenses() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_EXPENSE_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const r = await api.get("/transactions");
      const data = Array.isArray(r.data) ? r.data : (r.data?.data ?? r.data?.expenses ?? []);
      setItems(data);
    } catch (e) {
      console.error("Failed to load expenses:", e);
      setError(e.message || "Failed to load expenses");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!form.description.trim()) { setError("Description is required."); return; }
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) { 
      setError("Enter a valid amount."); 
      return; 
    }
    
    setSaving(true);
    setError("");
    
    const newExpense = { 
      ...form, 
      amount: parseFloat(form.amount),
      type: "expense" // Backend might need this
    };
    
    try {
      const r = await api.post("/transactions", newExpense);
      setItems([r.data, ...items]);
      setShowForm(false);
      setForm(EMPTY_EXPENSE_FORM);
    } catch (e) {
      console.error("Failed to add expense:", e);
      setError(e.message || "Failed to add expense");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    
    try {
      await api.delete(`/transactions/${id}`);
      setItems(items.filter(e => e.id !== id));
    } catch (e) {
      console.error("Failed to delete expense:", e);
      setError(e.message || "Failed to delete expense");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            {showForm ? "Cancel" : "+ Add Expense"}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Add New Expense</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Description"
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
              <input
                type="number"
                placeholder="Amount"
                value={form.amount}
                onChange={e => setForm({...form, amount: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              />
              <select
                value={form.category}
                onChange={e => setForm({...form, category: e.target.value})}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Utilities">Utilities</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other">Other</option>
              </select>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm({...form, date: e.target.value})}
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
              {saving ? "Saving..." : "Save Expense"}
            </button>
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">No expenses yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Add Your First Expense
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.map(expense => (
                  <tr key={expense.id}>
                    <td className="px-6 py-4">{expense.description}</td>
                    <td className="px-6 py-4">{expense.category}</td>
                    <td className="px-6 py-4 font-semibold text-red-600">
                      ${parseFloat(expense.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{expense.date}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
