import { useContext, useState } from "react";
import { FinanceContext } from "../context/FinanceContext";
import "./Debts.css";

function Debts() {
  const { debts, addDebt } = useContext(FinanceContext);
  const [creditor, setCreditor] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    addDebt({
      id: Date.now(),
      creditor,
      remaining: Number(amount),
    });

    setCreditor("");
    setAmount("");
  };

  return (
    <div className="debts-page">
      <h2>Debts</h2>

      <form onSubmit={handleSubmit} className="debt-form">
        <input
          placeholder="Creditor"
          value={creditor}
          onChange={(e) => setCreditor(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />

        <button>Add Debt</button>
      </form>

      <ul className="debt-list">
        {debts.map((d) => (
          <li key={d.id}>
            {d.creditor} — KSh {d.remaining}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Debts;