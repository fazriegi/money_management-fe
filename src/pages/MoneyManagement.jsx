import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import Period from "../components/Period";
import Income from "../components/Income";
import Expenditure from "../components/Expenditure";
import InputCurrency from "../components/InputCurrency";
import { useMoneyManagementContext } from "../context/MoneyManagementContext";
import Asset from "../components/Asset";
import Liability from "../components/Liability";

const MoneyManagement = () => {
  const [period, setPeriod] = useState("");
  const { totalIncome, totalExpense, totalCashflow, setTotalCashflow } =
    useMoneyManagementContext();

  const getPeriodDate = (date) => {
    // start period date every 27
    const startDate = date.date(27).format("DD/MM/YYYY");
    const endDate = date.add(1, "month").date(26).format("DD/MM/YYYY");

    setPeriod(`${startDate} - ${endDate}`);
  };

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

  useEffect(() => {
    getPeriodDate(today);
  }, []);

  useEffect(() => {
    setTotalCashflow(totalIncome - totalExpense);
  }, [totalIncome, totalExpense]);

  const changeDate = (date) => {
    const selectedDate = adjustDate(date);
    const formattedDate = selectedDate.format("MMM_YYYY").toLowerCase(); // to send to backend

    getPeriodDate(selectedDate);
  };

  return (
    <div id="money-management">
      <header>
        <Period style={{ visibility: "hidden" }} period={period} />
        <DatePicker
          picker="month"
          format="MMM YYYY"
          onChange={changeDate}
          defaultValue={today}
        />
        <Period period={period} />
      </header>
      <section>
        <h2 style={{ fontWeight: "bold" }}>Cashflow</h2>
        <div
          id="income-statement"
          style={{ display: "flex", gap: 20, border: "1px solid blue" }}
        >
          <Income />
          <Expenditure />
        </div>
        <div
          style={{
            backgroundColor: "#fff",
            width: "30%",
            margin: "1em auto",
            padding: "0.5em",
          }}
        >
          <InputCurrency
            label="Monthly Cashflow: "
            style={{ color: "#000" }}
            value={totalCashflow}
          />
        </div>

        <div id="balance-sheet" style={{ marginTop: "1em" }}>
          <h2 style={{ fontWeight: "bold" }}>Balance Sheet</h2>
          <div style={{ display: "flex", gap: 20, border: "1px solid blue" }}>
            <Asset />
            <Liability />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MoneyManagement;
