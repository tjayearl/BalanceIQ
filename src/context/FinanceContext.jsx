import { createContext, useState, useEffect } from "react";
import { storage } from "../utils/storage";

// eslint-disable-next-line react-refresh/only-export-components
export const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [expenses, setExpenses] = useState(() => {
    const saved = storage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [debts, setDebts] = useState(() => {
    const saved = storage.getItem("debts");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to user-specific localStorage
  useEffect(() => {
    storage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    storage.setItem("debts", JSON.stringify(debts));
  }, [debts]);

  // ====== ACTIONS ======
  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  const updateExpense = (id, updates) => {
    setExpenses((prev) => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter(e => e.id !== id));
  };

  const addDebt = (debt) => {
    setDebts((prev) => [...prev, debt]);
  };

  const updateDebt = (id, updates) => {
    setDebts((prev) => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  };

  const deleteDebt = (id) => {
    setDebts((prev) => prev.filter(d => d.id !== id));
  };

  return (
    <FinanceContext.Provider
      value={{
        expenses,
        debts,
        addExpense,
        updateExpense,
        deleteExpense,
        addDebt,
        updateDebt,
        deleteDebt,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}