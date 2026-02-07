import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineDollar, AiOutlineCreditCard, AiOutlinePlus, AiOutlineArrowRight, AiOutlineWallet } from 'react-icons/ai';

function DashboardCards() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-cards">
      {/* Balance Card - Static Summary */}
      <div className="card balance-card">
        <div className="card-header">
          <h3><AiOutlineWallet /> Total Balance</h3>
        </div>
        <p>Ksh 45,000</p>
        <span className="card-subtext">Available funds</span>
      </div>

      {/* Debts Card - Interactive */}
      <div 
        className="card debts-card interactive-card" 
        onClick={() => navigate('/dashboard/debts')}
        role="button"
        tabIndex={0}
      >
        <div className="card-header">
          <h3><AiOutlineCreditCard /> Debts</h3>
          <span className="card-arrow"><AiOutlineArrowRight /></span>
        </div>
        <p>Ksh 12,500</p>
        <span className="card-subtext">Total outstanding</span>
        <div className="card-footer">
          <span className="footer-info">3 active debts</span>
          <button 
            className="card-action-btn" 
            onClick={(e) => { 
              e.stopPropagation(); 
              navigate('/dashboard/debts'); 
            }}
          >
            <AiOutlinePlus /> Add
          </button>
        </div>
      </div>

      {/* Expenses Card - Interactive */}
      <div 
        className="card expenses-card interactive-card" 
        onClick={() => navigate('/dashboard/expenses')}
        role="button"
        tabIndex={0}
      >
        <div className="card-header">
          <h3><AiOutlineDollar /> Expenses</h3>
          <span className="card-arrow"><AiOutlineArrowRight /></span>
        </div>
        <p>Ksh 8,200</p>
        <span className="card-subtext">Spent this month</span>
        <div className="card-footer">
          <span className="footer-info">View breakdown</span>
          <button 
            className="card-action-btn" 
            onClick={(e) => { 
              e.stopPropagation(); 
              navigate('/dashboard/expenses'); 
            }}
          >
            <AiOutlinePlus /> Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardCards;