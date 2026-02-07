import React from "react";
import './Debts.css';

function Debts() {
  return (
    <div className="debts-container">
      <h2>Your Debts</h2>
      <table className="debts-table">
        <thead>
          <tr>
            <th>Debt Name</th>
            <th>Amount</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Credit Card</td>
            <td>$500</td>
            <td>2026-03-01</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Debts;