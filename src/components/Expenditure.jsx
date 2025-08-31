import { Form, Input, message, Select } from "antd";
import { useState, useEffect } from "react";
import Column from "antd/es/table/Column";
import InputCurrency from "../components/InputCurrency";
import { Calculate } from "../helper/helper";
import { useMoneyManagementContext } from "../context/MoneyManagementContext";
import MMFormTable from "./MMFormTable";
import api from "../helper/api";

export default function Expenditure() {
  const {
    totalExpense,
    setTotalExpense,
    periodCode,
    xs,
    liabilities,
    setRefetchLiability,
  } = useMoneyManagementContext();

  const [isEdit, setIsEdit] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [form] = Form.useForm();
  const [masterDataTemp, setMasterDataTemp] = useState({});

  const onSave = async () => {
    try {
      setFetchingData(true);
      const values = await form.validateFields();

      const data = values.data.map((obj, idx) => ({
        ...obj,
        order_no: idx + 1,
      }));

      const response = await api.put(`/expenses`, {
        period_code: periodCode,
        data,
      });

      const respBody = response?.data;
      if (respBody?.is_success && respBody?.data?.refetch_liability) {
        setRefetchLiability((prev) => prev + 1);
      }

      // setMasterDataTemp({ data: data, total: totalExpense });
      message.success("Expenses saved successfully!");
      getData();
      setIsEdit((prev) => !prev);
    } catch (err) {
      console.error(err);
      if (err.errorFields) {
        form.scrollToField(err.errorFields[0].name);
      } else if (!err?.response?.data?.is_success) {
        message.error(
          err?.response?.data?.message || "Failed to save expenses"
        );
      } else {
        message.error("Error save expenses:", err);
      }
    } finally {
      setFetchingData(false);
    }
  };

  const onCancel = () => {
    setIsEdit((prev) => !prev);
    form.setFieldsValue({ data: masterDataTemp?.data });
    setTotalExpense(masterDataTemp?.total);
  };

  const getData = async () => {
    setFetchingData(true);

    try {
      const res = await api.get(`/expenses?period_code=${periodCode}`);
      const data = res.data.data.map((obj, idx) => ({
        ...obj,
        key: `${idx + 1}`,
      }));

      form.setFieldsValue({ data: data });
      const total = Calculate(data);
      setMasterDataTemp({ data: data, total });
      setTotalExpense(total);
    } catch (err) {
      console.error(err);
      if (!err?.response?.data?.is_success) {
        message.error(err?.response?.data?.message || "Failed to get expenses");
      } else {
        message.error("Error get expenses:", err);
      }
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getData();
  }, [periodCode]);

  const columns = [
    <Column
      title="Liability"
      dataIndex="liability_id"
      key="liability"
      width={80}
      render={(_, record) => {
        // if this row use liability
        return (
          <Form.Item name={[record._idx, "liability_id"]} style={{ margin: 0 }}>
            <Select
              style={{ width: "100%" }}
              placeholder="Select Liability"
              disabled={!isEdit}
              onSelect={(value) => {
                const selectedLiability = liabilities.find(
                  (l) => l.id === value
                );

                if (selectedLiability) {
                  const newData = [
                    ...form.getFieldValue("data").map((item, idx) =>
                      idx === record._idx
                        ? {
                            ...item,
                            name: selectedLiability?.name || "",
                            liability_id: selectedLiability?.id,
                            value: selectedLiability?.installment || 0,
                          }
                        : item
                    ),
                  ];

                  form.setFieldsValue({
                    data: newData,
                  });

                  const total = Calculate(newData);
                  setTotalExpense(total);
                }
              }}
              autoFocus
            >
              {liabilities.map((liability) => (
                <Select.Option key={liability.id} value={liability.id}>
                  {liability.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );
      }}
    />,
    <Column
      title="Name"
      dataIndex="name"
      width={145}
      render={(_, record) => (
        <Form.Item
          name={[record._idx, "name"]}
          style={{ margin: 0 }}
          rules={[{ required: true, message: "" }]}
        >
          <Input
            style={{ width: "100%" }}
            placeholder="Expenditure Name"
            readOnly={!isEdit}
          />
        </Form.Item>
      )}
    />,
    <Column
      title="Value"
      dataIndex="value"
      width={145}
      render={(_, record) => (
        <Form.Item
          name={[record._idx, "value"]}
          style={{ margin: 0 }}
          rules={[{ required: true, message: "" }]}
        >
          <InputCurrency
            style={{ width: "100%" }}
            readOnly={!isEdit}
            onChange={() => {
              const total = Calculate(form.getFieldValue("data"));
              setTotalExpense(total);
            }}
          />
        </Form.Item>
      )}
    />,
  ];

  const footer = (
    <InputCurrency
      label="Total Expenditure: "
      value={totalExpense}
      labelUp={xs}
      readOnly
    />
  );

  return (
    <div style={xs ? { width: "100%" } : { width: "50%" }}>
      <MMFormTable
        title="Expenses"
        form={form}
        columns={columns}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        disableAction={!isEdit}
        loading={fetchingData}
        onSave={onSave}
        onCancel={onCancel}
        footer={footer}
        xs={xs}
      />
    </div>
  );
}
