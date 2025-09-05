import { Button, message, Typography } from "antd";
import moment from "moment";
import InputCurrency from "../../components/InputCurrency";
import { useCashflowContext } from "../../context/CashflowContext";
import ExpenseModal from "./ExpenseModal";
import Column from "antd/es/table/Column";
import SimpleTable from "../../components/SimpleTable";
import { PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "../../helper/api";
import qs from "qs";

const getRandomuserParams = (params) => ({
  limit: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

function Cashflow() {
  const { showExpenseModal } = useCashflowContext();
  const [fetchingData, setFetchingData] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [tableParams, setTableParams] = useState({
    pagination: {
      current: 1,
      pageSize: 100,
    },
  });

  const firstDate = moment().startOf("month").format("YYYY-MM-DD");
  const lastDate = moment().endOf("month").format("YYYY-MM-DD");

  const getData = async () => {
    setFetchingData(true);

    try {
      const res = await api.get(
        `/cashflow?${qs.stringify(
          getRandomuserParams(tableParams)
        )}&start_date=${firstDate}&end_date=${lastDate}`
      );

      const respData = res.data.data;
      const data = respData.data.map((obj, idx) => ({
        ...obj,
        key: `${idx + 1}`,
      }));

      setDataList(data);
      setTableParams({
        ...tableParams,
        pagination: {
          ...tableParams.pagination,
          total: respData.total,
        },
      });
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

  const handleTableChange = (pagination, filters, sorter) => {
    const sortArray = Array.isArray(sorter) ? sorter : [sorter];

    const sortString = sortArray
      .filter((s) => s && s.field && s.order)
      .map((s) => `${s.field} ${s.order === "ascend" ? "asc" : "desc"}`)
      .join(", ");

    setTableParams({
      pagination,
      filters,
      sort: sortString || "date desc",
    });
  };

  useEffect(() => {
    getData();
  }, [JSON.stringify(tableParams)]);

  const extraButton = [
    <Button key="add-income" icon={<PlusOutlined />}>
      Income
    </Button>,
    <Button
      key="add-expense"
      icon={<PlusOutlined />}
      onClick={showExpenseModal}
    >
      Expense
    </Button>,
  ];

  return (
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
          onRow={(record) => ({
            onClick: () => {
              if (record.type === "expense") {
                showExpenseModal();
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
      </div>
    </div>
  );
}

export default Cashflow;
