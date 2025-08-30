import { createContext, useContext, useState } from "react";
import dayjs from "dayjs";
import { Grid } from "antd";

export const MoneyManagementContext = createContext({});

// Create a custom provider component
export const MoneyManagementProvider = ({ children }) => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalCashflow, setTotalCashflow] = useState(0);
  const [totalAsset, setTotalAsset] = useState(0);
  const [totalLiability, setTotalLiability] = useState(0);
  const [netWorth, setNetWorth] = useState(0);
  const [liabilities, setLiabilities] = useState([]);
  const [refetchLiability, setRefetchLiability] = useState(0);

  const { useBreakpoint } = Grid;
  const { xs } = useBreakpoint();

  const adjustDate = (selectedDate) => {
    const periodStart = selectedDate.subtract(1, "month").date(27);
    const periodEnd = selectedDate.date(26);

    if (
      (selectedDate.isSame(periodStart) || selectedDate.isAfter(periodStart)) &&
      (selectedDate.isSame(periodEnd) || selectedDate.isBefore(periodEnd))
    ) {
      return periodStart;
    }
    return selectedDate;
  };

  const today = adjustDate(dayjs());
  const initPeriod = today.format("MMM_YYYY").toLowerCase();

  const [periodCode, setPeriodCode] = useState(initPeriod);

  const value = {
    today,
    adjustDate,
    periodCode,
    setPeriodCode,
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
    xs,
    liabilities,
    setLiabilities,
    refetchLiability,
    setRefetchLiability,
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
