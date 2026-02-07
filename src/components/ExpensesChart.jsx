import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { category: "Food", amount: 3000 },
  { category: "Transport", amount: 1500 },
  { category: "Entertainment", amount: 2000 },
  { category: "Bills", amount: 4500 },
  { category: "Shopping", amount: 1200 },
];

function ExpensesChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="category" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip cursor={{ fill: '#f1f5f9' }} />
        <Bar dataKey="amount" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ExpensesChart;