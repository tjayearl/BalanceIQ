import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { FiDollarSign, FiCheck, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import "./Onboarding.css";

const CURRENCIES = [
  { code: "KES", symbol: "KSh", label: "Kenyan Shilling" },
  { code: "USD", symbol: "$",   label: "US Dollar" },
];

const WORK_TYPES = [
  { value: "student",   label: "Student",            icon: "🎓", desc: "Currently studying, may have part-time income" },
  { value: "freelance", label: "Freelance Worker",   icon: "💻", desc: "Self-employed, variable monthly income" },
  { value: "fulltime",  label: "Full-Time Employee", icon: "🏢", desc: "Salaried, fixed monthly income" },
  { value: "mixed",     label: "Mixed Income",       icon: "⚡", desc: "Combination of employment and freelance" },
];

const EXPENSE_CATS = ["Housing","Food","Transport","Utilities","Entertainment","Health","Shopping","Education","Other"];

const BLANK_DEBT    = { name: "", lender: "", amount: "", interestRate: "", dueDate: "" };
const BLANK_EXPENSE = { category: "Housing", amount: "", description: "" };
const BLANK_INCOME  = { source: "", amount: "", type: "monthly" };

const STEPS = ["Profile","Income","Expenses","Debts","Review"];

export default function Onboarding() {
  const navigate  = useNavigate();
  const [step,    setStep]    = useState(0);
  const [error,   setError]   = useState("");

  const [workType, setWorkType] = useState("");
  const [currency, setCurrency] = useState("KES");

  const [incomes,  setIncomes]  = useState([{ source: "Main Job", amount: "", type: "monthly" }]);
  const [expenses, setExpenses] = useState([{ category: "Housing", amount: "", description: "" }]);
  const [debts,    setDebts]    = useState([]);
  const [noDebts,  setNoDebts]  = useState(false);

  const sym = CURRENCIES.find(c => c.code === currency)?.symbol || "KSh";

  const addIncome    = ()      => setIncomes(p => [...p, { ...BLANK_INCOME }]);
  const removeIncome = i       => setIncomes(p => p.filter((_, idx) => idx !== i));
  const setIncome    = (i,k,v) => setIncomes(p => p.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const addExpense    = ()      => setExpenses(p => [...p, { ...BLANK_EXPENSE }]);
  const removeExpense = i       => setExpenses(p => p.filter((_, idx) => idx !== i));
  const setExpense    = (i,k,v) => setExpenses(p => p.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const addDebt    = ()      => { setNoDebts(false); setDebts(p => [...p, { ...BLANK_DEBT }]); };
  const removeDebt = i       => setDebts(p => p.filter((_, idx) => idx !== i));
  const setDebt    = (i,k,v) => setDebts(p => p.map((x, idx) => idx === i ? { ...x, [k]: v } : x));
  const validate = () => {
    if (step === 0 && !workType)                                         { setError("Please select your work type."); return false; }
    if (step === 1 && incomes.some(i => !i.amount || !i.source.trim())) { setError("Please fill in all income fields."); return false; }
    if (step === 2 && expenses.some(e => !e.amount))                    { setError("Please fill in all expense amounts."); return false; }
    setError(""); return true;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => { setError(""); setStep(s => s - 1); };

  const handleFinish = async () => {
    // Prepare onboarding data
    const onboardingData = {
      workType,
      currency,
      incomes: incomes.map(i => ({ ...i, amount: parseFloat(i.amount) || 0 })),
      expenses: expenses.map(e => ({ ...e, amount: parseFloat(e.amount) || 0 })),
      debts: noDebts ? [] : debts.map(d => ({ 
        ...d, 
        amount: parseFloat(d.amount) || 0,
        interestRate: parseFloat(d.interestRate) || 0
      }))
    };
    
    setError("");
    
    try {
      // Send to backend
      await api.post("/auth/onboarding", onboardingData);
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (e) {
      console.error('Failed to save onboarding data:', e);
      let errorMessage = "Failed to save your data. Please try again.";
      if (e.response) {
        // Server responded with error
        errorMessage = e.response.data?.message || e.response.data?.error || `Server error: ${e.response.status}`;
      } else if (e.request) {
        // Request made but no response
        errorMessage = "Unable to connect to the server. Please check your internet connection.";
      } else if (e.message) {
        // Other error
        errorMessage = e.message;
      }
      setError(errorMessage);
    }
  };

  const totalIncome  = incomes.reduce((s, i)  => s + (parseFloat(i.amount)  || 0), 0);
  const totalExpense = expenses.reduce((s, e) => s + (parseFloat(e.amount)  || 0), 0);
  const totalDebt    = debts.reduce((s, d)    => s + (parseFloat(d.amount)  || 0), 0);

  return (
    <div className="ob-page">

      {/* ── Sidebar ── */}
      <div className="ob-sidebar">
        <div className="ob-sidebar__logo">⚖️ BalanceIQ</div>
        <p className="ob-sidebar__tagline">Let's set up your financial picture.</p>
        <ul className="ob-steps">
          {STEPS.map((s, i) => (
            <li key={s} className={`ob-step ${i === step ? "ob-step--active" : ""} ${i < step ? "ob-step--done" : ""}`}>
              <span className="ob-step__dot">
                {i < step ? <FiCheck /> : i + 1}
              </span>
              {s}
            </li>
          ))}
        </ul>
        <div className="ob-sidebar__disclaimer">
          BalanceIQ does not store or move money. Your data is only used to calculate your financial position.
        </div>
      </div>

      {/* ── Main ── */}
      <div className="ob-main">
        <div className="ob-card">

          {/* STEP 0 — Profile */}
          {step === 0 && (
            <div className="ob-section">
              <h2 className="ob-title">Tell us about yourself</h2>
              <p className="ob-sub">This helps us tailor your dashboard to your situation.</p>

              <div className="form-group" style={{ marginBottom:"1.5rem" }}>
                <label className="form-label">Preferred Currency</label>
                <div className="ob-currency-row">
                  {CURRENCIES.map(c => (
                    <button key={c.code} className={`ob-currency-btn ${currency === c.code ? "ob-currency-btn--active" : ""}`} onClick={() => setCurrency(c.code)} type="button">
                      <span className="ob-currency-btn__symbol">{c.symbol}</span>
                      <span className="ob-currency-btn__label">{c.label}</span>
                      {currency === c.code && <FiCheck className="ob-currency-btn__check" />}
                    </button>
                  ))}
                </div>
                <p className="ob-hint">KSh is the default for our Kenyan beta. You can change this later in Settings.</p>
              </div>

              <div className="form-group">
                <label className="form-label">What best describes your work situation?</label>
                <div className="ob-work-grid">
                  {WORK_TYPES.map(w => (
                    <button key={w.value} className={`ob-work-btn ${workType === w.value ? "ob-work-btn--active" : ""}`} onClick={() => setWorkType(w.value)} type="button">
                      <span className="ob-work-btn__icon">{w.icon}</span>
                      <span className="ob-work-btn__label">{w.label}</span>
                      <span className="ob-work-btn__desc">{w.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 — Income */}
          {step === 1 && (
            <div className="ob-section">
              <h2 className="ob-title">Your monthly income</h2>
              <p className="ob-sub">Add all your income sources. For freelancers, use your average monthly amount.</p>
              <div className="ob-list">
                {incomes.map((inc, i) => (
                  <div key={i} className="ob-list-item">
                    <div className="ob-list-item__head">
                      <span className="ob-list-item__num">Income {i + 1}</span>
                      {incomes.length > 1 && <button className="ob-remove" onClick={() => removeIncome(i)}>Remove</button>}
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Source</label>
                        <input className="form-input" placeholder={workType === "student" ? "e.g. Part-time job" : workType === "freelance" ? "e.g. Freelance Design" : "e.g. Salary"} value={inc.source} onChange={e => setIncome(i, "source", e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Monthly Amount ({sym})</label>
                        <div className="input-wrap">
                          <FiDollarSign className="input-icon" />
                          <input className="form-input" type="number" min="0" placeholder="0.00" value={inc.amount} onChange={e => setIncome(i, "amount", e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Income Type</label>
                        <select className="form-select" value={inc.type} onChange={e => setIncome(i, "type", e.target.value)}>
                          <option value="monthly">Monthly Salary</option>
                          <option value="freelance">Freelance / Variable</option>
                          <option value="business">Business Income</option>
                          <option value="allowance">Allowance / Stipend</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="ob-add-btn" onClick={addIncome} type="button">+ Add Another Income Source</button>
            </div>
          )}

          {/* STEP 2 — Expenses */}
          {step === 2 && (
            <div className="ob-section">
              <h2 className="ob-title">Your monthly expenses</h2>
              <p className="ob-sub">Add your regular monthly expenses. You can add more later.</p>
              <div className="ob-list">
                {expenses.map((exp, i) => (
                  <div key={i} className="ob-list-item">
                    <div className="ob-list-item__head">
                      <span className="ob-list-item__num">Expense {i + 1}</span>
                      {expenses.length > 1 && <button className="ob-remove" onClick={() => removeExpense(i)}>Remove</button>}
                    </div>
                    <div className="form-grid">
                      <div className="form-group">
                        <label className="form-label">Category</label>
                        <select className="form-select" value={exp.category} onChange={e => setExpense(i, "category", e.target.value)}>
                          {EXPENSE_CATS.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">Monthly Amount ({sym})</label>
                        <div className="input-wrap">
                          <FiDollarSign className="input-icon" />
                          <input className="form-input" type="number" min="0" placeholder="0.00" value={exp.amount} onChange={e => setExpense(i, "amount", e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group form-group--full">
                        <label className="form-label">Description <span className="form-hint">optional</span></label>
                        <input className="form-input" placeholder="e.g. Monthly rent" value={exp.description} onChange={e => setExpense(i, "description", e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="ob-add-btn" onClick={addExpense} type="button">+ Add Another Expense</button>
            </div>
          )}

          {/* STEP 3 — Debts */}
          {step === 3 && (
            <div className="ob-section">
              <h2 className="ob-title">Any debts or loans?</h2>
              <p className="ob-sub">Include bank loans, credit cards, personal loans, or money owed to anyone.</p>
              <label className="ob-no-debt-row">
                <input type="checkbox" checked={noDebts} onChange={e => { setNoDebts(e.target.checked); if (e.target.checked) setDebts([]); }} />
                <span>I currently have no debts</span>
              </label>
              {!noDebts && (
                <>
                  <div className="ob-list">
                    {debts.map((d, i) => (
                      <div key={i} className="ob-list-item">
                        <div className="ob-list-item__head">
                          <span className="ob-list-item__num">Debt {i + 1}</span>
                          <button className="ob-remove" onClick={() => removeDebt(i)}>Remove</button>
                        </div>
                        <div className="form-grid">
                          <div className="form-group">
                            <label className="form-label">Debt Name</label>
                            <input className="form-input" placeholder="e.g. Car Loan" value={d.name} onChange={e => setDebt(i, "name", e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Lender / Who You Owe</label>
                            <input className="form-input" placeholder="e.g. KCB Bank" value={d.lender} onChange={e => setDebt(i, "lender", e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Amount Owed ({sym})</label>
                            <div className="input-wrap">
                              <FiDollarSign className="input-icon" />
                              <input className="form-input" type="number" min="0" placeholder="0.00" value={d.amount} onChange={e => setDebt(i, "amount", e.target.value)} />
                            </div>
                          </div>
                          <div className="form-group">
                            <label className="form-label">Interest Rate (%) <span className="form-hint">optional</span></label>
                            <input className="form-input" type="number" min="0" step="0.1" placeholder="0.00" value={d.interestRate} onChange={e => setDebt(i, "interestRate", e.target.value)} />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Due Date <span className="form-hint">optional</span></label>
                            <input className="form-input" type="date" value={d.dueDate} onChange={e => setDebt(i, "dueDate", e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="ob-add-btn" onClick={addDebt} type="button">+ Add a Debt</button>
                </>
              )}
            </div>
          )}

          {/* STEP 4 — Review */}
          {step === 4 && (
            <div className="ob-section">
              <h2 className="ob-title">Review your information</h2>
              <p className="ob-sub">Here's a summary before we set up your dashboard.</p>
              <div className="ob-review-grid">
                <div className="ob-review-card">
                  <span className="ob-review-card__icon">👤</span>
                  <div>
                    <span className="ob-review-card__label">Work Type</span>
                    <span className="ob-review-card__value">{WORK_TYPES.find(w => w.value === workType)?.label}</span>
                  </div>
                </div>
                <div className="ob-review-card">
                  <span className="ob-review-card__icon">💰</span>
                  <div>
                    <span className="ob-review-card__label">Total Monthly Income</span>
                    <span className="ob-review-card__value ob-review-card__value--green">{sym} {totalIncome.toLocaleString()}</span>
                  </div>
                </div>
                <div className="ob-review-card">
                  <span className="ob-review-card__icon">🧾</span>
                  <div>
                    <span className="ob-review-card__label">Total Monthly Expenses</span>
                    <span className="ob-review-card__value ob-review-card__value--red">{sym} {totalExpense.toLocaleString()}</span>
                  </div>
                </div>
                <div className="ob-review-card">
                  <span className="ob-review-card__icon">💳</span>
                  <div>
                    <span className="ob-review-card__label">Total Debt</span>
                    <span className="ob-review-card__value ob-review-card__value--red">{sym} {totalDebt.toLocaleString()}</span>
                  </div>
                </div>
                <div className="ob-review-card">
                  <span className="ob-review-card__icon">📊</span>
                  <div>
                    <span className="ob-review-card__label">Monthly Net Position</span>
                    <span className={`ob-review-card__value ${totalIncome - totalExpense >= 0 ? "ob-review-card__value--green" : "ob-review-card__value--red"}`}>
                      {sym} {(totalIncome - totalExpense).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="ob-review-card">
                  <span className="ob-review-card__icon">🌍</span>
                  <div>
                    <span className="ob-review-card__label">Currency</span>
                    <span className="ob-review-card__value">{CURRENCIES.find(c => c.code === currency)?.label}</span>
                  </div>
                </div>
              </div>
              <div className="ob-review-note">
                You can edit all of this any time from your dashboard. This is just your starting point.
              </div>
            </div>
          )}

          {error && <div className="form-error" style={{ marginTop:"1rem" }}>{error}</div>}

          {/* Navigation */}
          <div className="ob-nav">
            {step > 0 && (
              <button className="btn btn--secondary" onClick={back} type="button">
                <FiChevronLeft /> Back
              </button>
            )}
            <div style={{ flex:1 }} />
            {step < 4 ? (
              <button className="btn btn--primary" onClick={next} type="button">
                Continue <FiChevronRight />
              </button>
            ) : (
              <button className="btn btn--primary btn--lg" onClick={handleFinish} type="button">
                Go to My Dashboard <FiChevronRight />
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}