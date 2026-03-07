import { useState } from "react";
import { FiUser, FiBell, FiShield, FiSave, FiCheck } from "react-icons/fi";
import "./Settings.css";

export default function Settings() {
  const [profile, setProfile] = useState({ name:"", email:"", currency:"USD" });
  const [notifs,  setNotifs]  = useState({ debtReminders:true, weeklyReport:false, overdueAlerts:true });
  const [saved,   setSaved]   = useState(false);

  const setP = (k,v) => setProfile(f => ({ ...f, [k]:v }));
  const setN = (k,v) => setNotifs(f => ({ ...f, [k]:v }));

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="page">
      <div className="page__header">
        <div><h1 className="page__title">Settings</h1><p className="page__sub">Manage your account preferences</p></div>
        <button className="btn btn--primary" onClick={save}>
          {saved ? <><FiCheck /> Saved!</> : <><FiSave /> Save Changes</>}
        </button>
      </div>

      <div className="settings-layout">
        <div className="card">
          <div className="settings-sec-head"><FiUser /><p className="card__title" style={{ margin:0 }}>Profile</p></div>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="Jane Doe" value={profile.name} onChange={e => setP("name", e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" placeholder="jane@example.com" value={profile.email} onChange={e => setP("email", e.target.value)} /></div>
            <div className="form-group">
              <label className="form-label">Currency</label>
              <select className="form-select" value={profile.currency} onChange={e => setP("currency", e.target.value)}>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="KES">KES — Kenyan Shilling</option>
                <option value="CAD">CAD — Canadian Dollar</option>
              </select>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="settings-sec-head"><FiBell /><p className="card__title" style={{ margin:0 }}>Notifications</p></div>
          <div className="notif-list">
            {[
              ["debtReminders","Debt payment reminders","Get reminded before debt due dates"],
              ["overdueAlerts", "Overdue debt alerts",   "Be notified when a debt becomes overdue"],
              ["weeklyReport",  "Weekly report",         "Receive a weekly summary of your finances"],
            ].map(([key, label, sub]) => (
              <div key={key} className="notif-row">
                <div><span className="notif-row__label">{label}</span><span className="notif-row__sub">{sub}</span></div>
                <button className={`toggle ${notifs[key] ? "toggle--on" : ""}`} onClick={() => setN(key, !notifs[key])} type="button">
                  <span className="toggle__thumb" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="settings-sec-head"><FiShield /><p className="card__title" style={{ margin:0 }}>Security</p></div>
          <div className="form-group" style={{ maxWidth:360 }}><label className="form-label">Current Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
          <div className="form-grid" style={{ marginTop:"0.875rem" }}>
            <div className="form-group"><label className="form-label">New Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
            <div className="form-group"><label className="form-label">Confirm Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
          </div>
          <button className="btn btn--secondary" style={{ marginTop:"0.875rem" }}>Update Password</button>
        </div>
      </div>
    </div>
  );
}