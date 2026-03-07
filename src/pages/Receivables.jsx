import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addReceivable, markAsReceived } from './receivablesSlice';

export function Receivables() {
  const receivables = useSelector((state) => state.receivables.items);
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddReceivable = (e) => {
    e.preventDefault();
    if (name && amount) {
      dispatch(addReceivable(name, Number(amount)));
      setName('');
      setAmount('');
    }
  };

  const activeReceivables = receivables.filter(
    (item) => item.status === 'unreceived'
  );

  return (
    <div className="receivables-section">
      <h3>Money Owed To Me</h3>
      <form onSubmit={handleAddReceivable}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Who owes you?"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {activeReceivables.length > 0 ? (
          activeReceivables.map((item) => (
            <li key={item.id}>
              <span>
                {item.name} - KES {item.amount.toLocaleString()}
              </span>
              <button onClick={() => dispatch(markAsReceived(item.id))}>
                Mark as Received
              </button>
            </li>
          ))
        ) : (
          <p>No one owes you money right now.</p>
        )}
      </ul>
    </div>
  );
}