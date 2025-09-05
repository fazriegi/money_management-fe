import { createContext, useContext, useState } from "react";

export const CashflowContext = createContext({});

export const CashflowProvider = ({ children }) => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const showExpenseModal = () => {
    setIsExpenseModalOpen(true);
  };

  const value = {
    isExpenseModalOpen,
    setIsExpenseModalOpen,
    showExpenseModal,
  };

  return (
    <CashflowContext.Provider value={value}>
      {children}
    </CashflowContext.Provider>
  );
};

// Create a custom hook for easy consumption
export const useCashflowContext = () => {
  const context = useContext(CashflowContext);
  if (!context) {
    throw new Error("useCashflow must be used within a CashflowProvider");
  }

  return context;
};
