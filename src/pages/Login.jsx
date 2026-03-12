import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { FiMail, FiLock, FiLoader, FiAlertCircle } from "react-icons/fi";
import "./Auth.css";

const BENEFITS = [
  { icon: "📊", text: "Track all your expenses in one place" },
  { icon: "💳", text: "Monitor debts and never miss a due date" },
  { icon: "🧾", text: "Estimate your tax liability instantly" },
  { icon: "📈", text: "See your real financial position clearly" },
];

export default function Login() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.email.trim())    { setError("Please enter your email."); return; }
    if (!form.password.trim()) { setError("Please enter your password."); return; }
    setLoading(true); setError("");
    try {
      const r = await api.post("/auth/login", {
        email:    form.email,
        password: form.password,
      });
      localStorage.setItem("token", r.data.access_token);
      // redirect based on presence of onboarding data saved in localStorage
      const hasOnboarding = localStorage.getItem('balanceiq_onboarding');
      navigate(hasOnboarding ? "/dashboard" : "/onboarding");
    } catch (e) {
      const isFrontend = e.type === "frontend";
      const isBackend  = e.type === "backend";
      const prefix     = isFrontend ? "⚠️ " : isBackend ? "🔴 Server: " : "";
      setError(prefix + (e.message || "Something went wrong. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleKey = e => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div className="auth-page">

      {/* ── Left panel ── */}
      <div className="auth-left">
        <Link to="/" className="auth-logo">⚖️ BalanceIQ</Link>
        <div className="auth-left__body">
          <h2 className="auth-left__title">Understand your real financial position.</h2>
          <p className="auth-left__sub">
            Track debts, money owed to you, and your actual financial
            position in one simple dashboard.
          </p>
          <ul className="auth-benefits">
            {BENEFITS.map(b => (
              <li key={b.text} className="auth-benefit">
                <span className="auth-benefit__icon">{b.icon}</span>
                <span>{b.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="auth-left__disclaimer">
          BalanceIQ does not store or move money. Your financial data is only
          used to calculate your financial position.
        </p>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-card__head">
            <h1 className="auth-card__title">Welcome back</h1>
            <p className="auth-card__sub">Log in to your BalanceIQ account</p>
          </div>

          {error && (
            <div className="auth-error">
              <FiAlertCircle /> {error}
            </div>
          )}

          <div className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <FiMail className="input-icon" />
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => set("email", e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="auth-label-row">
                <label className="form-label">Password</label>
                <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
              </div>
              <div className="input-wrap">
                <FiLock className="input-icon" />
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              className="auth-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <><FiLoader className="spin" /> Logging in…</> : "Log In"}
            </button>
          </div>

          <p className="auth-switch">
            Don't have an account? <Link to="/register" className="auth-switch__link">Create one free</Link>
          </p>

          <p className="auth-trust">
            🔒 BalanceIQ does not store or move money. Your data is only used to
            calculate your financial position.
          </p>
        </div>
      </div>
    </div>
  );
}