import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { FiUser, FiMail, FiLock, FiLoader, FiAlertCircle, FiCheck } from "react-icons/fi";
import "./Auth.css";

const BENEFITS = [
  { icon: "📊", text: "Track all your expenses in one place" },
  { icon: "💳", text: "Monitor debts and never miss a due date" },
  { icon: "🧾", text: "Estimate your tax liability instantly" },
  { icon: "📈", text: "See your real financial position clearly" },
];

const STRENGTH = pw => {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  const map = {
    1: { label: "Weak",   color: "#ef4444" },
    2: { label: "Fair",   color: "#f59e0b" },
    3: { label: "Good",   color: "#3b82f6" },
    4: { label: "Strong", color: "#10b981" },
  };
  return { score, ...(map[score] || {}) };
};

export default function Register() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ name: "", email: "", password: "", confirm: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const strength = STRENGTH(form.password);

  const handleSubmit = async () => {
    if (!form.name.trim())                        { setError("Please enter your full name."); return; }
    if (!form.email.trim())                       { setError("Please enter your email."); return; }
    if (!/\S+@\S+\.\S+/.test(form.email))        { setError("Please enter a valid email address."); return; }
    if (form.password.length < 8)                 { setError("Password must be at least 8 characters."); return; }
    if (form.password !== form.confirm)           { setError("Passwords do not match."); return; }

    setLoading(true); setError("");
    try {
      const r = await api.post("/auth/register", {
        name:     form.name,
        email:    form.email,
        password: form.password,
      });
      // Save token and user info
      localStorage.setItem("token", r.data.access_token);
      localStorage.setItem("user_id", r.data.user_id); // NEW: Save user ID
      localStorage.setItem("user_email", form.email); // NEW: Optional
      
      navigate("/onboarding");
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
          <h2 className="auth-left__title">Financial clarity starts here.</h2>
          <p className="auth-left__sub">
            Create your free account and see your real financial position
            in under 60 seconds.
          </p>
          <ul className="auth-benefits">
            {BENEFITS.map(b => (
              <li key={b.text} className="auth-benefit">
                <span className="auth-benefit__icon">{b.icon}</span>
                <span>{b.text}</span>
              </li>
            ))}
          </ul>
          <div className="auth-left__perks">
            {["Free to use","No credit card required","Takes 60 seconds"].map(p => (
              <span key={p} className="auth-perk"><FiCheck /> {p}</span>
            ))}
          </div>
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
            <h1 className="auth-card__title">Create your account</h1>
            <p className="auth-card__sub">Free forever · No credit card needed</p>
          </div>

          {error && (
            <div className="auth-error">
              <FiAlertCircle /> {error}
            </div>
          )}

          <div className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div className="input-wrap">
                <FiUser className="input-icon" />
                <input
                  className="form-input"
                  type="text"
                  placeholder="Jane Doe"
                  value={form.name}
                  onChange={e => set("name", e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="name"
                />
              </div>
            </div>

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
              <label className="form-label">Password</label>
              <div className="input-wrap">
                <FiLock className="input-icon" />
                <input
                  className="form-input"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={form.password}
                  onChange={e => set("password", e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="new-password"
                />
              </div>
              {form.password && (
                <div className="pw-strength">
                  <div className="pw-strength__bars">
                    {[1,2,3,4].map(n => (
                      <div
                        key={n}
                        className="pw-strength__bar"
                        style={{ background: n <= strength.score ? strength.color : "#e2e8f0" }}
                      />
                    ))}
                  </div>
                  <span className="pw-strength__label" style={{ color: strength.color }}>
                    {strength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrap">
                <FiLock className="input-icon" />
                <input
                  className="form-input"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={e => set("confirm", e.target.value)}
                  onKeyDown={handleKey}
                  autoComplete="new-password"
                />
              </div>
              {form.confirm && form.password !== form.confirm && (
                <p className="auth-field-error">Passwords do not match</p>
              )}
              {form.confirm && form.password === form.confirm && form.confirm.length > 0 && (
                <p className="auth-field-ok"><FiCheck /> Passwords match</p>
              )}
            </div>

            <button
              className="auth-btn"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <><FiLoader className="spin" /> Creating account…</> : "Create Account"}
            </button>
          </div>

          <p className="auth-switch">
            Already have an account? <Link to="/login" className="auth-switch__link">Log in</Link>
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