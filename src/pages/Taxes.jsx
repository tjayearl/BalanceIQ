import React, { useState } from "react";
import { AiOutlinePlus, AiOutlineSearch, AiOutlineEdit, AiOutlineDelete, AiOutlineCheck, AiOutlineFileText, AiOutlineDollar } from "react-icons/ai";
import "./Taxes.css";

const Taxes = () => {
  const [taxes] = useState([
    { id: 1, type: "Income Tax", amount: 15000, dueDate: "2026-02-28", status: "Pending" },
    { id: 2, type: "VAT", amount: 5000, dueDate: "2026-03-15", status: "Paid" },
    { id: 3, type: "Property Tax", amount: 25000, dueDate: "2026-04-01", status: "Pending" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter logic
  const filteredTaxes = taxes.filter(tax => {
    const matchesSearch = tax.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || tax.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculations for Summary Cards
  const totalTaxes = taxes.reduce((acc, curr) => acc + curr.amount, 0);
  const paidTaxes = taxes.filter(t => t.status === "Paid").reduce((acc, curr) => acc + curr.amount, 0);
  const pendingTaxes = taxes.filter(t => t.status === "Pending").reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="taxes-container">
      <div className="taxes-header">
        <h2>Taxes</h2>
        <button className="add-tax-btn"><AiOutlinePlus /> Add Tax Record</button>
      </div>

      {/* Summary Cards */}
      <div className="tax-summary">
        <div className="card total-taxes">
          <div className="card-icon"><AiOutlineFileText /></div>
          <div>
            <h3>Total Taxes</h3>
            <p>Ksh {totalTaxes.toLocaleString()}</p>
          </div>
        </div>
        <div className="card paid-taxes">
          <div className="card-icon"><AiOutlineCheck /></div>
          <div>
            <h3>Paid</h3>
            <p>Ksh {paidTaxes.toLocaleString()}</p>
          </div>
        </div>
        <div className="card pending-taxes">
          <div className="card-icon"><AiOutlineDollar /></div>
          <div>
            <h3>Pending</h3>
            <p>Ksh {pendingTaxes.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-bar">
          <AiOutlineSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search tax types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="status-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Table */}
      <table className="tax-table">
        <thead>
          <tr>
            <th>Tax Name</th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTaxes.map((tax) => (
            <tr key={tax.id}>
              <td data-label="Tax Name">{tax.type}</td>
              <td data-label="Amount">Ksh {tax.amount.toLocaleString()}</td>
              <td data-label="Due Date">{tax.dueDate}</td>
              <td data-label="Status">
                <span className={`status ${tax.status.toLowerCase()}`}>
                  {tax.status}
                </span>
              </td>
              <td data-label="Actions" className="action-buttons">
                <button className="icon-btn edit-btn" title="Edit"><AiOutlineEdit /></button>
                <button className="icon-btn pay-btn" title="Mark Paid"><AiOutlineCheck /></button>
                <button className="icon-btn delete-btn" title="Delete"><AiOutlineDelete /></button>
              </td>
            </tr>
          ))}
          {filteredTaxes.length === 0 && (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>No tax records found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Taxes;