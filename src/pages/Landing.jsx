import { Link } from "react-router-dom";
import "./Landing.css";

const FEATURES = [
  { icon: "📊", title: "Expense Tracking", desc: "Log and categorize every expense. See exactly where your money goes each month." },
  { icon: "💳", title: "Debt Management", desc: "Track what you owe, to whom, and when it's due. Never miss a payment again." },
  { icon: "🧾", title: "Tax Calculator", desc: "Estimate your federal tax liability instantly with up-to-date 2025 brackets." },
  { icon: "📈", title: "Financial Dashboard", desc: "See your full financial picture in one clean, easy-to-read dashboard." },
];

const STEPS = [
  { n: "1", title: "Create your account", desc: "Sign up free in under a minute. No credit card required." },
  { n: "2", title: "Add your data", desc: "Enter your expenses, debts, and income at your own pace." },
  { n: "3", title: "Get clarity", desc: "Instantly see your real financial position in one dashboard." },
];

export default function Landing() {
  return (
    <div className="landing">

      {/* ── Nav ── */}
      <nav className="land-nav">
        <div className="land-nav__inner">
          <span className="land-nav__logo">⚖️ BalanceIQ</span>
          <div className="land-nav__actions">
            <Link to="/login"    className="btn-outline">Log In</Link>
            <Link to="/register" className="btn-filled">Get Started Free</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__badge">Financial Clarity Platform</div>
          <h1 className="hero__title">
            Understand your real<br />
            <span className="hero__title--accent">financial position</span>
          </h1>
          <p className="hero__sub">
            BalanceIQ is a financial clarity dashboard that helps you track your money,
            debts, and balances in one place — so you always know exactly where you stand.
          </p>
          <div className="hero__cta">
            <Link to="/register" className="btn-filled btn-filled--lg">Start Tracking Free</Link>
            <Link to="/login"    className="btn-outline btn-outline--lg">I have an account</Link>
          </div>
          <p className="hero__note">No credit card required · Free to use · Takes 60 seconds to set up</p>
        </div>

        {/* Floating stat cards */}
        <div className="hero__cards">
          <div className="hero-card">
            <span className="hero-card__label">Total Expenses</span>
            <span className="hero-card__value">$1,486.39</span>
            <span className="hero-card__sub c-danger">↑ This month</span>
          </div>
          <div className="hero-card hero-card--offset">
            <span className="hero-card__label">Active Debts</span>
            <span className="hero-card__value">$25,800</span>
            <span className="hero-card__sub c-warning">3 active</span>
          </div>
          <div className="hero-card">
            <span className="hero-card__label">Debts Cleared</span>
            <span className="hero-card__value">$500</span>
            <span className="hero-card__sub c-success">↓ Paid off</span>
          </div>
        </div>
      </section>

      {/* ── Disclaimer Banner ── */}
      <div className="disclaimer-banner">
        <span className="disclaimer-banner__icon">🔒</span>
        <p>
          <strong>BalanceIQ is not a bank.</strong> We do not hold, transfer, or manage your funds.
          BalanceIQ is a financial tracking and analytics tool designed to help you monitor your financial situation.
        </p>
      </div>

      {/* ── Features ── */}
      <section className="section">
        <div className="section__inner">
          <div className="section__head">
            <h2 className="section__title">Everything you need for financial clarity</h2>
            <p className="section__sub">Simple tools that give you a complete picture of your finances.</p>
          </div>
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card">
                <span className="feature-card__icon">{f.icon}</span>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section section--alt">
        <div className="section__inner">
          <div className="section__head">
            <h2 className="section__title">Get started in 3 steps</h2>
            <p className="section__sub">No complicated setup. No learning curve.</p>
          </div>
          <div className="steps">
            {STEPS.map(s => (
              <div key={s.n} className="step">
                <div className="step__num">{s.n}</div>
                <h3 className="step__title">{s.title}</h3>
                <p className="step__desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section section--cta">
        <div className="section__inner section__inner--center">
          <h2 className="section__title section__title--white">Ready to get financial clarity?</h2>
          <p className="section__sub section__sub--white">
            Join thousands of people who track their finances with BalanceIQ.
          </p>
          <div className="hero__cta" style={{ justifyContent:"center" }}>
            <Link to="/register" className="btn-filled btn-filled--lg">Create Free Account</Link>
            <Link to="/login"    className="btn-outline btn-outline--white btn-outline--lg">Log In</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="land-footer">
        <div className="land-footer__inner">
          <div className="land-footer__brand">
            <span className="land-nav__logo">⚖️ BalanceIQ</span>
            <p className="land-footer__tagline">Financial clarity for everyone.</p>
          </div>
          <div className="land-footer__links">
            <Link to="/register">Get Started</Link>
            <Link to="/login">Log In</Link>
          </div>
        </div>
        <div className="land-footer__disclaimer">
          BalanceIQ is not a bank and does not provide financial services. It is a financial tracking
          and analytics tool designed to help users monitor their financial situation.
          BalanceIQ does not hold, transfer, or manage user funds and is not a banking or financial institution.
        </div>
        <div className="land-footer__copy">© 2026 BalanceIQ. All rights reserved.</div>
      </footer>

    </div>
  );
}