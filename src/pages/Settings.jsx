import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { FiUser, FiBell, FiShield, FiSave, FiCheck, FiLoader } from "react-icons/fi";
import "./Settings.css";

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "", email: "", currency: "USD", workType: "" });
  const [notifs, setNotifs] = useState({ debtReminders: true, weeklyReport: false, overdueAlerts: true });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const r = await api.get("/auth/profile");
      setProfile({
        name: r.data.name || "",
        email: r.data.email || "",
        currency: r.data.currency || "USD",
        workType: r.data.workType || ""
      });
      // Note: Notifications would need a separate endpoint if implemented on backend
    } catch (e) {
      console.error("Failed to load settings:", e);
      setError(e.message || "Failed to load settings");
      if (e.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const setP = (k, v) => setProfile(f => ({ ...f, [k]: v }));
  const setN = (k, v) => setNotifs(f => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      await api.put("/auth/profile", {
        name: profile.name,
        currency: profile.currency,
        workType: profile.workType
        // Note: Email changes might need separate verification
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error("Failed to save settings:", e);
      setError(e.message || "Failed to save settings");
      if (e.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page__header">
        <div><h1 className="page__title">Settings</h1><p className="page__sub">Manage your account preferences</p></div>
        <button className="btn btn--primary" onClick={save} disabled={saving}>
          {saving ? <><FiLoader className="animate-spin" /> Saving...</> : saved ? <><FiCheck /> Saved!</> : <><FiSave /> Save Changes</>}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="settings-layout">
        <div className="card">
          <div className="settings-sec-head"><FiUser /><p className="card__title" style={{ margin:0 }}>Profile</p></div>
          <div className="form-grid">
            <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" placeholder="Jane Doe" value={profile.name} onChange={e => setP("name", e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" placeholder="jane@example.com" value={profile.email} onChange={e => setP("email", e.target.value)} disabled /></div>
            <div className="form-group">
              <label className="form-label">Work Type</label>
              <select className="form-select" value={profile.workType} onChange={e => setP("workType", e.target.value)}>
                <option value="">Select work type</option>
                <option value="student">Student</option>
                <option value="freelance">Freelance Worker</option>
                <option value="fulltime">Full-Time Employee</option>
                <option value="mixed">Mixed Income</option>
              </select>
            </div>
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