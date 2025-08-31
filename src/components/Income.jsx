import { Form, Input, message, Select } from "antd";
import { useState, useEffect } from "react";
import Column from "antd/es/table/Column";
import InputCurrency from "../components/InputCurrency";
import { Calculate } from "../helper/helper";
import { useMoneyManagementContext } from "../context/MoneyManagementContext";
import MMFormTable from "./MMFormTable";
import api from "../helper/api";

export default function Income() {
  const { totalIncome, setTotalIncome, periodCode, xs } =
    useMoneyManagementContext();

  const [fetchingData, setFetchingData] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
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

      await api.put(`/incomes`, {
        period_code: periodCode,
        data,
      });

      // setMasterDataTemp({ data, total: totalIncome });
      message.success("Incomes saved successfully!");
      getData();
      setIsEdit((prev) => !prev);
    } catch (err) {
      if (err.errorFields) {
        form.scrollToField(err.errorFields[0].name);
      } else if (!err?.response?.data?.is_success) {
        message.error(err?.response?.data?.message || "Failed to save incomes");
      } else {
        message.error("Error save incomes:", err);
      }
    } finally {
      setFetchingData(false);
    }
  };

  const onCancel = () => {
    setIsEdit((prev) => !prev);
    form.setFieldsValue({ data: masterDataTemp?.data });
    setTotalIncome(masterDataTemp?.total);
  };

  const getData = async () => {
    setFetchingData(true);

    try {
      const res = await api.get(`/incomes?period_code=${periodCode}`);
      const data = res.data.data.map((obj, idx) => ({
        ...obj,
        key: `${idx + 1}`,
      }));

      form.setFieldsValue({ data: data });
      const total = Calculate(data);
      setMasterDataTemp({ data: data, total });
      setTotalIncome(total);
    } catch (err) {
      if (!err?.response?.data?.is_success) {
        message.error(err?.response?.data?.message || "Failed to get incomes");
      } else {
        message.error("Error get incomes:", err);
      }
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getData();
  }, [periodCode]);

  const footer = (
    <InputCurrency
      label="Total Income: "
      value={totalIncome}
      labelUp={xs}
      readOnly
    />
  );

  const columns = [
    <Column
      title="Type"
      dataIndex="type"
      width={70}
      render={(_, record) => (
        <Form.Item
          name={[record._idx, "type"]}
          style={{ margin: 0 }}
          rules={[{ required: true, message: "" }]}
        >
          <Select
            style={{ width: "100%" }}
            placeholder="Select"
            disabled={!isEdit}
            options={[
              {
                label: "Passive",
                value: "passive",
              },
              {
                label: "Active",
                value: "active",
              },
            ]}
          />
        </Form.Item>
      )}
    />,
    <Column
      title="Name"
      dataIndex="name"
      width={150}
      render={(_, record) => (
        <Form.Item
          name={[record._idx, "name"]}
          style={{ margin: 0 }}
          rules={[{ required: true, message: "" }]}
        >
          <Input
            style={{ width: "100%" }}
            placeholder="Income Name"
            readOnly={!isEdit}
          />
        </Form.Item>
      )}
    />,
    <Column
      title="Value"
      dataIndex="value"
      width={150}
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
              setTotalIncome(total);
            }}
          />
        </Form.Item>
      )}
    />,
  ];

  return (
    <div style={xs ? { width: "100%" } : { width: "50%" }}>
      <MMFormTable
        title="Incomes"
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
