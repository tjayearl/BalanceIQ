import React from 'react';

function DashboardCards() {
  return (
    <div className="dashboard-cards">
      <div className="card balance-card">
        <h3>Total Balance</h3>
        <p>Ksh 45,000</p>
      </div>
      <div className="card debts-card">
        <h3>Debts</h3>
        <p>Ksh 12,500</p>
      </div>
      <div className="card expenses-card">
        <h3>Expenses</h3>
        <p>Ksh 8,200</p>
      </div>
    </div>
  );
}

export default DashboardCards;