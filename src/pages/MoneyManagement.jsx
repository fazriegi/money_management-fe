import { useEffect, useState } from "react";
import { DatePicker, Grid } from "antd";
import dayjs from "dayjs";
import Period from "../components/Period";
import Income from "../components/Income";
import Expenditure from "../components/Expenditure";
import InputCurrency from "../components/InputCurrency";
import { useMoneyManagementContext } from "../context/MoneyManagementContext";
import Asset from "../components/Asset";
import Liability from "../components/Liability";

const { useBreakpoint } = Grid;

const MoneyManagement = () => {
  const { xs } = useBreakpoint();

  const [period, setPeriod] = useState("");
  const {
    today,
    adjustDate,
    setPeriodCode,
    totalIncome,
    totalExpense,
    totalCashflow,
    setTotalCashflow,
    totalAsset,
    totalLiability,
    netWorth,
    setNetWorth,
  } = useMoneyManagementContext();

  const setPeriodInfo = (date) => {
    // start period date every 27
    const startDate = date.date(27).format("DD/MM/YYYY");
    const endDate = date.add(1, "month").date(26).format("DD/MM/YYYY");

    setPeriod(`${startDate} - ${endDate}`);
  };

  useEffect(() => {
    setPeriodInfo(today);
  }, []);

  useEffect(() => {
    setTotalCashflow(totalIncome - totalExpense);
  }, [totalIncome, totalExpense]);

  useEffect(() => {
    setNetWorth(totalAsset - totalLiability);
  }, [totalAsset, totalLiability]);

  const changeDate = (date) => {
    const selectedDate = adjustDate(date);
    const formattedDate = selectedDate.format("MMM_YYYY").toLowerCase(); // to send to backend

    setPeriodCode(formattedDate);

    setPeriodInfo(selectedDate);
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
          allowClear={false}
        />
        <Period period={period} />
      </header>
      <section>
        <div className="glass-dark">
          <div
            style={
              !xs ? { display: "flex", justifyContent: "space-between" } : {}
            }
          >
            <h2 style={{ fontWeight: "bold" }}>Cashflow</h2>
            <div id="monthly-cashflow">
              <InputCurrency
                label="Monthly Cashflow: "
                value={totalCashflow}
                labelUp={xs}
                readOnly
              />
            </div>
          </div>
          <div id="income-statement" style={{ width: "100%" }}>
            <Income />
            <Expenditure />
          </div>
        </div>

        <div
          id="balance-sheet"
          style={{ marginTop: "2.5em" }}
          className="glass-dark"
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2 style={{ fontWeight: "bold" }}>Balance Sheet</h2>
            <div id="net-worth">
              <InputCurrency
                label="Net Worth: "
                value={netWorth}
                labelUp={xs}
                readOnly
              />
            </div>
          </div>
          <div id="asset-liability">
            <Asset />
            <Liability />
          </div>
        </div>
      </section>
    </div>
  );
};

export default MoneyManagement;
