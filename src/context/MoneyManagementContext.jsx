import { createContext, useContext, useState } from "react";

export const MoneyManagementContext = createContext({});

// Create a custom provider component
export const MoneyManagementProvider = ({ children }) => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalCashflow, setTotalCashflow] = useState(0);
  const [totalAsset, setTotalAsset] = useState(0);
  const [totalLiability, setTotalLiability] = useState(0);
  const [netWorth, setNetWorth] = useState(0);

  const value = {
    totalIncome,
    totalExpense,
    setTotalIncome,
    setTotalExpense,
    totalCashflow,
    setTotalCashflow,
    totalAsset,
    setTotalAsset,
    totalLiability,
    setTotalLiability,
    netWorth,
    setNetWorth,
  };

  return (
    <MoneyManagementContext.Provider value={value}>
      {children}
    </MoneyManagementContext.Provider>
  );
};

// Create a custom hook for easy consumption
export const useMoneyManagementContext = () => {
  const context = useContext(MoneyManagementContext);
  if (!context) {
    throw new Error(
      "useMoneyManagement must be used within a MoneyManagementProvider"
    );
  }

  return context;
};
