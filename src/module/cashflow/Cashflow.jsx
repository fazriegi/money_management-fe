import { Button, DatePicker, Grid, message, Spin, Typography } from "antd";
import moment from "moment";
import ExpenseModal from "./components/ExpenseModal";
import Column from "antd/es/table/Column";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import qs from "qs";
import IncomeModal from "./components/IncomeModal";
import InputCurrency from "src/components/InputCurrency";
import { useCashflowContext } from "src/context/CashflowContext";
import SimpleTable from "src/components/SimpleTable";
import api from "src/helper/api";
import dayjs from "dayjs";

const getApiParam = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

const { useBreakpoint } = Grid;

function Cashflow() {
  const {
    showModal,
    refetchCashflow,
    adjustDate,
    currentMonth,
    setCurrentMonth,
    period,
    firstDayOfMonth,
    setFirstDayOfMonth,
  } = useCashflowContext();

  const { xs } = useBreakpoint();

  const [fetchingPeriod, setFetchingPeriod] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 5,
      total: 0,
    },
  });
  const [total, setTotal] = useState({
    income: 0,
    expense: 0,
    cashflow: 0,
  });

  const periodRef = useRef();
  periodRef.current = period;

  const getData = async (params = tableParams) => {
    try {
      if (!periodRef.current?.start || !periodRef.current?.end) {
        return;
      }

      setFetchingData(true);

      const apiParams = {
        ...getApiParam(params),
        start_date: periodRef.current.start.format("YYYY-MM-DD"),
        end_date: periodRef.current.end.format("YYYY-MM-DD"),
      };

      const res = await api.get(`/cashflow?${qs.stringify(apiParams)}`);

      const respData = res.data.data;
      const data = respData.cashflow.data.map((obj, idx) => ({
        ...obj,
        key: `${idx + 1}`,
      }));

      setDataList(data);
      setTotal({
        income: respData.cashflow.total_income,
        expense: respData.cashflow.total_expense,
        cashflow: respData.cashflow.total_cashflow,
      });

      setTableParams((prev) => ({
        ...prev,
        pagination: {
          ...prev.pagination,
          total: respData.total,
        },
      }));
    } catch (err) {
      if (!err?.response?.data?.is_success) {
        message.error(err?.response?.data?.message || "Failed to get cashflow");
      } else {
        message.error("Error get cashflow:", err);
      }
    } finally {
      setFetchingData(false);
    }
  };

  const getMonthlyPeriod = async () => {
    try {
      setFetchingPeriod(true);
      const res = await api.get("/period");
      const respData = res.data.data;

      setFirstDayOfMonth(respData?.day_of_month);
      setCurrentMonth(adjustDate(dayjs(), respData?.day_of_month));
    } catch (err) {
      if (!err?.response?.data?.is_success) {
        message.error(err?.response?.data?.message || "Failed to get period");
      } else {
        message.error("Error get period:", err);
      }
    } finally {
      setFetchingPeriod(false);
    }
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const sortArray = Array.isArray(sorter) ? sorter : [sorter];

    const sortString = sortArray
      .filter((s) => s && s.field && s.order)
      .map((s) => `${s.field} ${s.order === "ascend" ? "asc" : "desc"}`)
      .join(", ");

    const newParams = {
      pagination,
      filters,
      sort: sortString || "date desc",
    };

    setTableParams(newParams);
    getData(newParams);
  };

  useEffect(() => {
    getMonthlyPeriod();
  }, []);

  useEffect(() => {
    if (period?.start && period?.end) {
      const resetParams = {
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          current: 1,
        },
      };

      setTableParams(resetParams);
      getData(resetParams);
    }
  }, [period]);

  useEffect(() => {
    if (refetchCashflow > 0) {
      getData();
    }
  }, [refetchCashflow]);

  const extraButton = [
    <Button
      key="add-income"
      icon={<PlusOutlined />}
      onClick={() => showModal("add", "income")}
    >
      Income
    </Button>,
    <Button
      key="add-expense"
      icon={<PlusOutlined />}
      onClick={() => showModal("add", "expense")}
    >
      Expense
    </Button>,
  ];

  const footer = (
    <>
      <Typography.Text strong style={{ fontSize: "1.2em" }}>
        Total
      </Typography.Text>
      <div
        style={{
          display: "flex",
          flexDirection: xs ? "column" : "row",
          gap: "1em",
        }}
      >
        <InputCurrency
          label="Income: "
          value={total.income}
          labelUp={true}
          readOnly
        />
        <InputCurrency
          label="Expense: "
          value={total.expense}
          labelUp={true}
          status="error"
          readOnly
        />
        <InputCurrency
          label="Cashflow: "
          value={total.cashflow}
          labelUp={true}
          {...(total.cashflow < 0 ? { status: "error" } : {})}
          readOnly
        />
      </div>
    </>
  );

  return (
    <div style={{ marginTop: "3em" }}>
      {fetchingPeriod ? (
        <Spin />
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DatePicker
              picker="month"
              format="MMM YYYY"
              defaultValue={currentMonth}
              allowClear={false}
              onChange={(date, _) =>
                setCurrentMonth(adjustDate(date, firstDayOfMonth))
              }
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "2em",
            }}
          >
            <div style={{ width: "100%", maxWidth: "600px" }}>
              <SimpleTable
                title="Cashflow"
                dataSource={dataList}
                rowKey="key"
                bordered
                style={{ width: "100%" }}
                extraButton={extraButton}
                loading={fetchingData}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
                tableLayout="fixed"
                footer={footer}
                onRow={(record) => ({
                  onClick: () => {
                    if (record.type === "expense") {
                      showModal("edit", "expense", record?.id);
                    } else {
                      showModal("edit", "income", record?.id);
                    }
                  },
                })}
              >
                <Column
                  title="Date"
                  dataIndex="date"
                  key="date"
                  width={120}
                  sorter={{ multiple: 1 }}
                  render={(val) => (
                    <Typography.Text>
                      {moment(val).format("DD-MM-YYYY")}
                    </Typography.Text>
                  )}
                />
                <Column
                  title="Category"
                  dataIndex="category"
                  key="category"
                  width={200}
                  sorter={{ multiple: 2 }}
                />
                <Column
                  title="Value"
                  dataIndex="value"
                  key="value"
                  render={(value, rec) => (
                    <InputCurrency
                      style={{ width: "100%" }}
                      value={value}
                      {...(rec.type === "expense" ? { status: "error" } : {})}
                      readOnly
                    />
                  )}
                />
              </SimpleTable>
              <ExpenseModal />
              <IncomeModal />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cashflow;
