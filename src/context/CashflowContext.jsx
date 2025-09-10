import { createContext, useContext, useState } from "react";

export const CashflowContext = createContext({});

export const CashflowProvider = ({ children }) => {
  const [openFormModal, setOpenFormModal] = useState(null);
  const [modalData, setModalData] = useState();
  const [refetchCashflow, setRefetchCashflow] = useState(0);

  const showModal = (type = "add", modalType, id) => {
    setModalData({ type, id });
    setOpenFormModal(modalType);
  };

  const value = {
    openFormModal,
    setOpenFormModal,
    showModal,
    modalData,
    setModalData,
    refetchCashflow,
    setRefetchCashflow,
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
