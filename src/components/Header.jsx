import React from 'react';
import { AiOutlineBell, AiOutlineUser } from 'react-icons/ai';
import icon from '../assets/BalanceIQ-icon.png';

function Header() {
  return (
    <header className="dashboard-header">
      <div className="header-brand">
        <img src={icon} alt="Logo" className="header-logo" />
        <h2>BalanceIQ</h2>
      </div>
      <div className="header-actions">
        <button className="icon-btn"><AiOutlineBell /></button>
        <div className="user-profile">
          <span className="user-name">User</span>
          <AiOutlineUser className="user-avatar" />
        </div>
      </div>
    </header>
  );
}

export default Header;