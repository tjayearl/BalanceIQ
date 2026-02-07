import React from 'react';
import DashboardCards from '../components/DashboardCards';
import ExpensesChart from '../components/ExpensesChart';
import QuickActions from '../components/QuickActions';
import './DashboardHome.css';

function DashboardHome() {
  return (
    <div className="dashboard-home">
      <h2>Overview</h2>
      <DashboardCards />
      
      <div className="charts-section">
        <div className="chart-container">
          <h3>Expense Breakdown</h3>
          <ExpensesChart />
        </div>
      </div>

      <QuickActions />
    </div>
  );
}

export default DashboardHome;