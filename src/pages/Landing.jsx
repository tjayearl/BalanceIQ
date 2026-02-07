import { Link } from "react-router-dom";
import "./Landing.css";
import icon from "../assets/BalanceIQ-icon.png";

function Landing() {
  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-nav">
        <div className="nav-brand">
          <img src={icon} alt="BalanceIQ" className="nav-logo" />
          <span>BalanceIQ</span>
        </div>
        <div className="nav-links">
          <Link to="/login" className="nav-link">Log In</Link>
          <Link to="/register" className="nav-btn">Get Started</Link>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Take Control of Your Money. <br />Think Smarter with BalanceIQ.</h1>
          <p className="hero-sub">
            BalanceIQ helps you track expenses, manage debts, plan taxes, and understand your finances — all in one clean, intelligent dashboard.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">✅ Get Started</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">👤 Log In</Link>
          </div>
          <p className="hero-note">Free to start • Secure • Built for everyday people</p>
        </div>
      </header>

      {/* 2. What is BalanceIQ? */}
      <section className="section about-section">
        <div className="container">
          <h2>What is BalanceIQ?</h2>
          <p className="lead-text">
            BalanceIQ is a smart financial management platform built to help individuals understand their money without needing an accounting background. Whether you’re tracking daily expenses, managing debts, or preparing for taxes, BalanceIQ brings everything into one simple, easy-to-use system.
          </p>
          <p>Instead of spreadsheets and guesswork, BalanceIQ gives you clarity, structure, and insight into your financial life.</p>
        </div>
      </section>

      {/* 3. Problems Solved */}
      <section className="section problems-section">
        <div className="container">
          <h2>Why BalanceIQ Exists</h2>
          <div className="grid-cards">
            <div className="card problem-card">❌ “I don’t know where my money goes”</div>
            <div className="card problem-card">❌ “I forget debts and due dates”</div>
            <div className="card problem-card">❌ “Taxes confuse me”</div>
            <div className="card problem-card">❌ “Finance apps are too complicated”</div>
          </div>
          <p className="section-note">BalanceIQ was built to solve these exact problems — simply and intelligently.</p>
        </div>
      </section>

      {/* 4. Core Features */}
      <section className="section features-section">
        <div className="container">
          <h2>Core Features</h2>
          <div className="grid-cards">
            <div className="card feature-card">
              <h3>🧾 Expenses Tracking</h3>
              <p>Track daily, weekly, and monthly expenses with clarity. See categories, trends, and spending habits at a glance.</p>
            </div>
            <div className="card feature-card">
              <h3>💳 Debt Management</h3>
              <p>Keep track of loans, balances, due dates, and repayments. Know exactly what you owe and what’s coming next.</p>
            </div>
            <div className="card feature-card">
              <h3>📊 Smart Dashboard</h3>
              <p>A central dashboard that shows your financial health in real-time — no digging, no confusion.</p>
            </div>
            <div className="card feature-card">
              <h3>🧮 Tax Preparation</h3>
              <p>Organize taxable income, expenses, and deductions so tax season doesn’t catch you off guard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Who is it for? & 6. Security */}
      <section className="section split-section">
        <div className="container grid-split">
          <div className="text-block">
            <h2>Built for Everyone</h2>
            <ul className="check-list">
              <li>👩‍🎓 Students managing allowances or side income</li>
              <li>👨‍💼 Professionals tracking salaries and expenses</li>
              <li>🧑‍💻 Freelancers managing irregular income</li>
              <li>🏠 Anyone who wants financial clarity</li>
            </ul>
          </div>
          <div className="text-block">
            <h2>Your Data, Protected</h2>
            <ul className="check-list">
              <li>🔒 Secure authentication</li>
              <li>🔐 Encrypted user data</li>
              <li>👁️ Privacy-focused design</li>
              <li>🚫 No selling of personal data</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. Call To Action */}
      <section className="section cta-section">
        <div className="container">
          <h2>Start Managing Your Money Smarter Today</h2>
          <div className="cta-actions">
            <Link to="/register" className="btn btn-primary btn-lg">🚀 Create Free Account</Link>
            <Link to="/login" className="btn btn-secondary btn-lg">🔑 Log In</Link>
          </div>
          <p className="cta-note">It only takes a minute to get started.</p>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>BalanceIQ © 2026</p>
          <div className="footer-links">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Contact / Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;