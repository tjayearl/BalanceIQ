import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBalances } from './balanceSlice';

export function BalanceForm() {
  const dispatch = useDispatch();
  const [bank, setBank] = useState('');
  const [mpesa, setMpesa] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert to numbers and dispatch to the store
    dispatch(
      setBalances({
        bank: Number(bank) || 0,
        mpesa: Number(mpesa) || 0,
      })
    );
    // Optional: Clear fields after submission
    setBank('');
    setMpesa('');
  };

  return (
    <form onSubmit={handleSubmit} className="balance-form">
      <h3>Starting Balance</h3>
      <div>
        <label htmlFor="bank-balance">Bank Amount</label>
        <input
          id="bank-balance"
          type="number"
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          placeholder="e.g., 10000"
        />
      </div>
      <div>
        <label htmlFor="mpesa-balance">M-Pesa Amount</label>
        <input
          id="mpesa-balance"
          type="number"
          value={mpesa}
          onChange={(e) => setMpesa(e.target.value)}
          placeholder="e.g., 5000"
        />
      </div>
      <button type="submit">Set Balance</button>
    </form>
  );
}