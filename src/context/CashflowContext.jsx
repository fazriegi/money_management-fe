import { createContext, useContext, useState } from "react";
import { getPeriodRange } from "src/helper/helper";

export const CashflowContext = createContext({});

export const CashflowProvider = ({ children }) => {
  const [openFormModal, setOpenFormModal] = useState(null);
  const [modalData, setModalData] = useState();
  const [refetchCashflow, setRefetchCashflow] = useState(0);
  const [firstDayOfMonth, setFirstDayOfMonth] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [period, setPeriod] = useState();

  const showModal = (type = "add", modalType, id) => {
    setModalData({ type, id });
    setOpenFormModal(modalType);
  };

  const adjustDate = (selectedDate, startDayOfMonth) => {
    const [periodStart, periodEnd] = getPeriodRange(
      selectedDate,
      startDayOfMonth
    );

    setPeriod({ start: periodStart, end: periodEnd });
    if (
      (selectedDate.isSame(periodStart) || selectedDate.isAfter(periodStart)) &&
      (selectedDate.isSame(periodEnd) || selectedDate.isBefore(periodEnd))
    ) {
      return periodStart;
    }
    return selectedDate;
  };

  const value = {
    openFormModal,
    setOpenFormModal,
    showModal,
    modalData,
    setModalData,
    refetchCashflow,
    setRefetchCashflow,
    adjustDate,
    currentMonth,
    setCurrentMonth,
    period,
    firstDayOfMonth,
    setFirstDayOfMonth,
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
