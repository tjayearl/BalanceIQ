import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineBell, AiOutlineUser, AiOutlineSetting, AiOutlineLogout, AiOutlineQuestionCircle, AiOutlineLock } from 'react-icons/ai';
import icon from '../assets/BalanceIQ-icon.png';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'expense', icon: '💸', title: 'Expense Alert', message: 'You’ve spent Ksh 5,000 today', time: '2h ago', read: false },
    { id: 2, type: 'debt', icon: '💳', title: 'Debt Reminder', message: 'Loan payment due in 3 days', time: '5h ago', read: false },
    { id: 3, type: 'insight', icon: '📊', title: 'Financial Insight', message: 'You spent 12% less this month 👏', time: '1d ago', read: true },
    { id: 4, type: 'security', icon: '🔐', title: 'Security Alert', message: 'New login detected from Chrome', time: '2d ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    navigate('/'); // Redirect to landing page
  };

  return (
    <header className="dashboard-header">
      <div className="header-brand">
        <img src={icon} alt="Logo" className="header-logo" />
        <h2>BalanceIQ</h2>
      </div>
      <div className="header-actions">
        
        <div className="notification-wrapper">
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <AiOutlineBell />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
                <button className="mark-read-btn" onClick={markAllAsRead}>Mark all read</button>
              </div>
              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div key={notification.id} className={`notification-item ${!notification.read ? 'unread' : ''}`} onClick={() => handleNotificationClick(notification.id)}>
                      <div className="notification-icon">{notification.icon}</div>
                      <div className="notification-content">
                        <span className="notification-title">{notification.title}</span>
                        <span className="notification-message">{notification.message}</span>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-notifications">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="profile-wrapper">
          <div className="user-profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <span className="user-name">User</span>
            <AiOutlineUser className="user-avatar" />
          </div>

          {showProfileMenu && (
            <>
              <div className="dropdown-overlay" onClick={() => setShowProfileMenu(false)}></div>
              <div className="profile-dropdown">
                <div className="profile-header-info">
                  <div className="profile-avatar-large">
                    <AiOutlineUser />
                  </div>
                  <div className="profile-text">
                    <h4>User</h4>
                    <span>user@example.com</span>
                  </div>
                </div>
                <ul className="profile-menu">
                  <li onClick={() => { navigate('/dashboard/settings'); setShowProfileMenu(false); }}><AiOutlineUser /> Profile</li>
                  <li onClick={() => { navigate('/dashboard/settings'); setShowProfileMenu(false); }}><AiOutlineSetting /> Settings</li>
                  <li onClick={() => { navigate('/dashboard/settings'); setShowProfileMenu(false); }}><AiOutlineLock /> Security</li>
                  <li onClick={() => setShowProfileMenu(false)}><AiOutlineQuestionCircle /> Help & Support</li>
                  <li onClick={handleLogout} className="logout-item">
                    <AiOutlineLogout /> Logout
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;