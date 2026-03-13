import { useState } from "react";
import axios from "axios";
import { FiDollarSign, FiInfo, FiLoader, FiRefreshCw } from "react-icons/fi";
import "./TaxCalculator.css";

const BRACKETS = {
  single:             [{ max:11925,rate:.10},{max:48475,rate:.12},{max:103350,rate:.22},{max:197300,rate:.24},{max:250525,rate:.32},{max:626350,rate:.35},{max:Infinity,rate:.37}],
  married_jointly:    [{ max:23850,rate:.10},{max:96950,rate:.12},{max:206700,rate:.22},{max:394600,rate:.24},{max:501050,rate:.32},{max:751600,rate:.35},{max:Infinity,rate:.37}],
  married_separately: [{ max:11925,rate:.10},{max:48475,rate:.12},{max:103350,rate:.22},{max:197300,rate:.24},{max:250525,rate:.32},{max:375800,rate:.35},{max:Infinity,rate:.37}],
  head_of_household:  [{ max:17000,rate:.10},{max:64850,rate:.12},{max:103350,rate:.22},{max:197300,rate:.24},{max:250500,rate:.32},{max:626350,rate:.35},{max:Infinity,rate:.37}],
};
const STD_DED = { single:14600, married_jointly:29200, married_separately:14600, head_of_household:21900 };

function calcTax(income, status) {
  let tax = 0, breakdown = [];
  let prevMax = 0;
  for (const b of BRACKETS[status]) {
    if (income <= prevMax) break;
    const taxable = Math.min(income, b.max) - prevMax;
    tax += taxable * b.rate;
    breakdown.push({ rate: b.rate * 100, taxable, tax: taxable * b.rate });
    prevMax = b.max;
  }
  return { tax, breakdown };
}

function marginalRate(income, status) {
  let prev = 0;
  for (const b of BRACKETS[status]) {
    if (income > prev && income <= b.max) return b.rate * 100;
    prev = b.max;
  }
  return 37;
}

const BLANK = { filingStatus:"single", grossIncome:"", additionalIncome:"", deductionType:"standard", itemizedAmount:"", withheld:"", taxYear:"2025" };
const fmt = n => n < 0 ? `-$${Math.abs(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}` : `$${n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}`;

export default function TaxCalculator() {
  const [form,       setForm]        = useState(BLANK);
  const [result,     setResult]      = useState(null);
  const [calculating,setCalculating] = useState(false);
  const [useBackend, setUseBackend]  = useState(false);
  const [backendErr, setBackendErr]  = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const calculate = async () => {
    const gross = parseFloat(form.grossIncome) || 0;
    if (gross <= 0) return;
    setCalculating(true); setBackendErr("");

    if (useBackend) {
      try { const r = await axios.post("/api/taxes/calculate", form); setResult(r.data); setCalculating(false); return; }
      catch { setBackendErr("Backend unavailable — using frontend calculation."); }
    }

    await new Promise(r => setTimeout(r, 350));
    const totalGross    = gross + (parseFloat(form.additionalIncome) || 0);
    const stdDed        = STD_DED[form.filingStatus];
    const itemized      = parseFloat(form.itemizedAmount) || 0;
    const deduction     = form.deductionType === "standard" ? stdDed : Math.max(stdDed, itemized);
    const taxableIncome = Math.max(0, totalGross - deduction);
    const { tax: federalTax, breakdown } = calcTax(taxableIncome, form.filingStatus);
    const withheld  = parseFloat(form.withheld) || 0;
    const refund    = withheld - federalTax;
    const effective = totalGross > 0 ? (federalTax / totalGross) * 100 : 0;
    const marginal  = marginalRate(taxableIncome, form.filingStatus);

    setResult({ totalGross, deduction, taxableIncome, federalTax, withheld, refund, effective, marginal, breakdown });
    setCalculating(false);
  };

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Tax Calculator</h1>
          <p className="page__sub">US federal income tax estimate for {form.taxYear}</p>
        </div>
        <div className="tax-hdr">
          <label className="toggle-row">
            <span className="toggle-label">Use backend API</span>
            <button className={`toggle ${useBackend ? "toggle--on" : ""}`} onClick={() => setUseBackend(v => !v)}>
              <span className="toggle__thumb" />
            </button>
          </label>
          {result && <button className="btn btn--secondary btn--sm" onClick={() => { setResult(null); setForm(BLANK); }}><FiRefreshCw /> Reset</button>}
        </div>
      </div>

      {backendErr && <div className="form-error" style={{ marginBottom:"1rem" }}>{backendErr}</div>}

      <div className="tax-layout">
        <div className="card tax-inputs">
          <p className="card__title">Your Information</p>
          <div className="form-group">
            <label className="form-label">Tax Year</label>
            <select className="form-select" value={form.taxYear} onChange={e => set("taxYear", e.target.value)}>
              <option value="2025">2025</option><option value="2024">2024</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Filing Status</label>
            <select className="form-select" value={form.filingStatus} onChange={e => set("filingStatus", e.target.value)}>
              <option value="single">Single</option>
              <option value="married_jointly">Married Filing Jointly</option>
              <option value="married_separately">Married Filing Separately</option>
              <option value="head_of_household">Head of Household</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Gross W-2 Income ($)</label>
            <div className="input-wrap"><FiDollarSign className="input-icon" /><input className="form-input" type="number" min="0" placeholder="75000" value={form.grossIncome} onChange={e => set("grossIncome", e.target.value)} /></div>
          </div>
          <div className="form-group">
            <label className="form-label">Additional Income ($) <span className="form-hint">freelance, dividends…</span></label>
            <div className="input-wrap"><FiDollarSign className="input-icon" /><input className="form-input" type="number" min="0" placeholder="0" value={form.additionalIncome} onChange={e => set("additionalIncome", e.target.value)} /></div>
          </div>
          <div className="form-group">
            <label className="form-label">Deductions</label>
            <div className="radio-row">
              <label className="radio-item"><input type="radio" checked={form.deductionType==="standard"} onChange={() => set("deductionType","standard")} /> Standard (${STD_DED[form.filingStatus].toLocaleString()})</label>
              <label className="radio-item"><input type="radio" checked={form.deductionType==="itemized"} onChange={() => set("deductionType","itemized")} /> Itemized</label>
            </div>
            {form.deductionType === "itemized" && (
              <div className="input-wrap" style={{ marginTop:"0.5rem" }}><FiDollarSign className="input-icon" /><input className="form-input" type="number" min="0" placeholder="e.g. 18000" value={form.itemizedAmount} onChange={e => set("itemizedAmount", e.target.value)} /></div>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Tax Withheld ($) <span className="form-hint">W-2 box 2</span></label>
            <div className="input-wrap"><FiDollarSign className="input-icon" /><input className="form-input" type="number" min="0" placeholder="0" value={form.withheld} onChange={e => set("withheld", e.target.value)} /></div>
          </div>
          <button className="btn btn--primary btn--full btn--lg" onClick={calculate} disabled={!form.grossIncome || calculating}>
            {calculating ? <><FiLoader className="spin" /> Calculating…</> : "Calculate My Tax"}
          </button>
          <p className="tax-disclaimer"><FiInfo /> Estimates only. US federal tax only — does not include state, FICA, AMT, or credits.</p>
        </div>

        <div className="tax-results">
          {!result ? (
            <div className="empty"><span className="empty__icon">🧮</span><p>Fill in your info and click Calculate.</p></div>
          ) : (
            <>
              <div className={`refund-banner ${result.refund >= 0 ? "refund-banner--green" : "refund-banner--red"}`}>
                <span className="refund-banner__label">{result.refund >= 0 ? "Estimated Refund" : "Estimated Amount Owed"}</span>
                <span className="refund-banner__amount">{fmt(Math.abs(result.refund))}</span>
              </div>
              <div className="stats-grid" style={{ marginBottom:"0.875rem" }}>
                <div className="stat-card"><span className="stat-card__label">Federal Tax</span><span className="stat-card__value">{fmt(result.federalTax)}</span></div>
                <div className="stat-card"><span className="stat-card__label">Taxable Income</span><span className="stat-card__value">${result.taxableIncome.toLocaleString()}</span></div>
                <div className="stat-card"><span className="stat-card__label">Effective Rate</span><span className="stat-card__value">{result.effective.toFixed(1)}%</span></div>
                <div className="stat-card"><span className="stat-card__label">Marginal Rate</span><span className="stat-card__value">{result.marginal}%</span></div>
              </div>
              <div className="card">
                <p className="card__title">Calculation Summary</p>
                <table className="tax-table">
                  <tbody>
                    <tr><td>Gross Income</td><td>{fmt(result.totalGross)}</td></tr>
                    <tr><td>Deduction ({form.deductionType})</td><td>-{fmt(result.deduction)}</td></tr>
                    <tr className="tax-table__hl"><td>Taxable Income</td><td>{fmt(result.taxableIncome)}</td></tr>
                    <tr><td>Federal Income Tax</td><td>{fmt(result.federalTax)}</td></tr>
                    <tr><td>Tax Withheld</td><td>-{fmt(result.withheld)}</td></tr>
                    <tr className={`tax-table__hl ${result.refund >= 0 ? "tax-table__hl--green" : "tax-table__hl--red"}`}>
                      <td><strong>{result.refund >= 0 ? "Refund" : "Owed"}</strong></td>
                      <td><strong>{fmt(Math.abs(result.refund))}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="card">
                <p className="card__title">Bracket Breakdown</p>
                <div className="bracket-list">
                  {result.breakdown.map((b, i) => (
                    <div key={i} className="bracket-row">
                      <span className="bracket-row__rate">{b.rate}%</span>
                      <div className="bracket-row__track"><div className="bracket-row__fill" style={{ width:`${Math.min(100,(b.taxable/result.taxableIncome)*100)}%` }} /></div>
                      <span className="bracket-row__tax">{fmt(b.tax)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}