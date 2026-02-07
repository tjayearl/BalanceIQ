import React, { useState } from "react";
import { AiOutlineUser, AiOutlineBell, AiOutlineLock, AiOutlineSetting, AiOutlineCloudUpload, AiOutlineDelete } from "react-icons/ai";
import "./Settings.css";

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="settings-section">
            <div className="setting-card">
              <h3>Profile Information</h3>
              <div className="profile-upload">
                <div className="avatar-placeholder"><AiOutlineUser /></div>
                <button className="upload-btn"><AiOutlineCloudUpload /> Upload Photo</button>
              </div>
              <label>Full Name</label>
              <input type="text" defaultValue="User" />
              <label>Email Address</label>
              <input type="email" defaultValue="user@example.com" />
              <button className="save-btn">Save Changes</button>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="settings-section">
            <div className="setting-card">
              <h3>Notification Preferences</h3>
              <div className="toggle-row">
                <span>Expense Alerts</span>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-row">
                <span>Debt Reminders</span>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-row">
                <span>Tax Deadlines</span>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-row">
                <span>Security Alerts</span>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="toggle-row">
                <span>Monthly Insights</span>
                <label className="switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        );
      case "security":
        return (
          <div className="settings-section">
            <div className="setting-card">
              <h3>Change Password</h3>
              <label>Current Password</label>
              <input type="password" />
              <label>New Password</label>
              <input type="password" />
              <label>Confirm New Password</label>
              <input type="password" />
              <button className="save-btn">Update Password</button>
            </div>
            <div className="setting-card danger-zone">
              <h3>Danger Zone</h3>
              <p>Once you delete your account, there is no going back. Please be certain.</p>
              <button className="delete-btn"><AiOutlineDelete /> Delete Account</button>
            </div>
          </div>
        );
      case "preferences":
        return (
          <div className="settings-section">
            <div className="setting-card">
              <h3>App Preferences</h3>
              <div className="toggle-row">
                <span>Dark Mode</span>
                <label className="switch">
                  <input type="checkbox" />
                  <span className="slider round"></span>
                </label>
              </div>
              <label>Default Currency</label>
              <select defaultValue="KES">
                <option value="KES">Kenyan Shilling (KES)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
          <AiOutlineUser /> Profile
        </button>
        <button className={activeTab === "notifications" ? "active" : ""} onClick={() => setActiveTab("notifications")}>
          <AiOutlineBell /> Notifications
        </button>
        <button className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>
          <AiOutlineLock /> Security
        </button>
        <button className={activeTab === "preferences" ? "active" : ""} onClick={() => setActiveTab("preferences")}>
          <AiOutlineSetting /> Preferences
        </button>
      </div>
      <div className="settings-main">
        <h2>Settings</h2>
        {renderContent()}
      </div>
    </div>
  );
}

export default Settings;