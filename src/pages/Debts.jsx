import React, { useState } from "react";
import { AiOutlinePlus, AiOutlineSearch, AiOutlineEdit, AiOutlineDelete, AiOutlineCheck } from "react-icons/ai";
import './Debts.css';

function Debts() {
  const [debts, setDebts] = useState([
    { id: 1, creditor: "John Doe", amount: 5000, dueDate: "2026-02-15", status: "Pending" },
    { id: 2, creditor: "Credit Card", amount: 1200, dueDate: "2026-03-01", status: "Paid" },
    { id: 3, creditor: "Jane Smith", amount: 3000, dueDate: "2026-01-20", status: "Overdue" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDebts = debts.filter(debt =>
    debt.creditor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="debts-container">
      <div className="debts-header">
        <h2>Debts</h2>
        <button className="add-debt-btn"><AiOutlinePlus /> Add Debt</button>
      </div>

      <div className="search-bar">
        <AiOutlineSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search creditors..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="debt-table">
        <thead>
          <tr>
            <th>Creditor</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDebts.map((debt) => (
            <tr key={debt.id}>
              <td>{debt.creditor}</td>
              <td>Ksh {debt.amount.toLocaleString()}</td>
              <td>{debt.dueDate}</td>
              <td>
                <span className={`status ${debt.status.toLowerCase()}`}>
                  {debt.status}
                </span>
              </td>
              <td className="action-buttons">
                <button className="icon-btn edit-btn" title="Edit"><AiOutlineEdit /></button>
                <button className="icon-btn pay-btn" title="Mark as Paid"><AiOutlineCheck /></button>
                <button className="icon-btn delete-btn" title="Delete"><AiOutlineDelete /></button>
              </td>
            </tr>
          ))}
          {filteredDebts.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>No debts found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Debts;