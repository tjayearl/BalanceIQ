import { useContext, useState } from "react";
import { FinanceContext } from "../context/FinanceContext";
import "./Expenses.css";

function Expenses() {
  const { expenses, addExpense } = useContext(FinanceContext);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const handleSubmit = (e) => {
    e.preventDefault();

    addExpense({
      id: Date.now(),
      amount: Number(amount),
      category,
      date: new Date().toLocaleDateString(),
    });

    setAmount("");
  };

  return (
    <div className="expenses-page">
      <h2>Expenses</h2>

      <form onSubmit={handleSubmit} className="expense-form">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Food</option>
          <option>Transport</option>
          <option>Rent</option>
          <option>Shopping</option>
          <option>Loans</option>
        </select>

        <button>Add Expense</button>
      </form>

      <ul className="expense-list">
        {expenses.map((e) => (
          <li key={e.id}>
            KSh {e.amount} — {e.category}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Expenses;