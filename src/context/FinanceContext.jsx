import { createContext, useState, useEffect } from "react";

export const FinanceContext = createContext();

export function FinanceProvider({ children }) {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });

  const [debts, setDebts] = useState(() => {
    const saved = localStorage.getItem("debts");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage (MVP persistence)
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem("debts", JSON.stringify(debts));
  }, [debts]);

  // ====== ACTIONS ======
  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  const addDebt = (debt) => {
    setDebts((prev) => [...prev, debt]);
  };

  return (
    <FinanceContext.Provider
      value={{
        expenses,
        debts,
        addExpense,
        addDebt,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}