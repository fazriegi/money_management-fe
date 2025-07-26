import { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import Period from "../components/Period";
import Income from "../components/Income";

const MoneyManagement = () => {
  const [period, setPeriod] = useState("");

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
        <div id="income-statement">
          <Income />
        </div>
      </section>
    </div>
  );
};

export default MoneyManagement;
