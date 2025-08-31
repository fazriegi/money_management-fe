import { Form, Input, message } from "antd";
import { useState, useEffect } from "react";
import Column from "antd/es/table/Column";
import InputCurrency from "../components/InputCurrency";
import { Calculate } from "../helper/helper";
import { useMoneyManagementContext } from "../context/MoneyManagementContext";
import MMFormTable from "./MMFormTable";
import api from "../helper/api";

export default function Liability() {
  const {
    totalLiability,
    setTotalLiability,
    periodCode,
    xs,
    setLiabilities,
    refetchLiability,
  } = useMoneyManagementContext();

  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [masterDataTemp, setMasterDataTemp] = useState({});
  const [fetchingData, setFetchingData] = useState(false);

  const onSave = async () => {
    try {
      setFetchingData(true);
      const values = await form.validateFields();

      const data = values.data.map((obj, idx) => ({
        ...obj,
        order_no: idx + 1,
      }));

      await api.put(`/liabilities`, {
        period_code: periodCode,
        data,
      });

      // setMasterDataTemp({ data: data, total: totalLiability });
      message.success("Liabilities saved successfully!");
      getData();

      setIsEdit((prev) => !prev);
    } catch (err) {
      console.error(err);
      if (err.errorFields) {
        form.scrollToField(err.errorFields[0].name);
      } else if (!err?.response?.data?.is_success) {
        message.error(
          err?.response?.data?.message || "Failed to save liabilities"
        );
      } else {
        message.error("Error save liabilities:", err);
      }
    } finally {
      setFetchingData(false);
    }
  };

  const onCancel = () => {
    setIsEdit((prev) => !prev);
    form.setFieldsValue({ data: masterDataTemp?.data });
    setTotalLiability(masterDataTemp?.total);
  };

  const deleteValidation = async (id) => {
    try {
      const res = await api.get(`/liabilities/validate-delete?id=${id}`);

      return res?.data?.data?.is_safe;
    } catch (err) {
      console.error(err);
      if (!err?.response?.data?.is_success) {
        message.error(
          err?.response?.data?.message || "Failed to validate delete liability"
        );
      } else {
        message.error("Error validate delete liability:", err);
      }

      return false;
    }
  };

  const getData = async () => {
    setFetchingData(true);

    try {
      const res = await api.get(`/liabilities?period_code=${periodCode}`);
      const data = res.data.data.map((obj, idx) => ({
        ...obj,
        key: `${idx + 1}`,
      }));

      setLiabilities(data);

      form.setFieldsValue({ data: data });
      const total = Calculate(data);
      setMasterDataTemp({ data: data, total });
      setTotalLiability(total);
    } catch (err) {
      console.error(err);
      if (!err?.response?.data?.is_success) {
        message.error(
          err?.response?.data?.message || "Failed to get liabilities"
        );
      } else {
        message.error("Error get liabilities:", err);
      }
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    getData();
  }, [periodCode, refetchLiability]);

  const columns = [
    <Column
      title="Name"
      dataIndex="name"
      width={150}
      render={(_, record) => (
        <div style={{ display: "flex", width: "100%" }}>
          <Form.Item name={[record._idx, "id"]} hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name={[record._idx, "name"]}
            style={{ margin: 0, flex: 1 }}
            rules={[{ required: true, message: "" }]}
          >
            <Input
              style={{ width: "100%" }}
              placeholder="Liability Name"
              readOnly={!isEdit}
            />
          </Form.Item>
        </div>
      )}
    />,
    <Column
      title="Value"
      dataIndex="value"
      width={110}
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
              setTotalLiability(total);
            }}
          />
        </Form.Item>
      )}
    />,
    <Column
      title="Installment"
      dataIndex="installment"
      width={110}
      render={(_, record) => (
        <Form.Item
          name={[record._idx, "installment"]}
          style={{ margin: 0 }}
        >
          <InputCurrency
            style={{ width: "100%" }}
            readOnly={!isEdit}
            onChange={() => {
              const total = Calculate(form.getFieldValue("data"));
              setTotalLiability(total);
            }}
          />
        </Form.Item>
      )}
    />,
  ];

  const footer = (
    <InputCurrency
      label="Total Liability: "
      value={totalLiability}
      labelUp={xs}
      readOnly
    />
  );

  return (
    <div style={{ width: "100%" }}>
      <MMFormTable
        title="Liabilities"
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
        deleteValidation={deleteValidation}
      />
    </div>
  );
}
