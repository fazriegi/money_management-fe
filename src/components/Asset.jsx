import { Form, Input, InputNumber, message } from "antd";
import { useState, useEffect } from "react";
import Column from "antd/es/table/Column";
import InputCurrency from "../components/InputCurrency";
import { Calculate } from "../helper/helper";
import { BASE_URL, FORMATNUMBER } from "../constant/Constant";
import { useMoneyManagementContext } from "../context/MoneyManagementContext";
import axios from "axios";
import MMFormTable from "./MMFormTable";

export default function Asset() {
  const { totalAsset, setTotalAsset, periodCode, xs } =
    useMoneyManagementContext();

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

      await axios.put(`${BASE_URL}/assets`, {
        period_code: periodCode,
        data,
      });

      setMasterDataTemp({ data, total: totalAsset });
      message.success("Assets saved successfully!");

      setIsEdit((prev) => !prev);
    } catch (err) {
      if (err.errorFields) {
        form.scrollToField(err.errorFields[0].name);
      } else if (!err?.response?.data?.is_success) {
        message.error(err?.response?.data?.message || "Failed to save assets");
      } else {
        message.error("Error save assets:", err);
      }
    } finally {
      setFetchingData(false);
    }
  };

  const onCancel = () => {
    setIsEdit((prev) => !prev);
    form.setFieldsValue({ data: masterDataTemp?.data });
    setTotalAsset(masterDataTemp?.total);
  };

  const getData = async () => {
    setFetchingData(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/assets?period_code=${periodCode}`
      );
      const data = res.data.data.map((obj, idx) => ({
        ...obj,
        key: `${idx + 1}`,
      }));

      form.setFieldsValue({ data: data });
      const total = Calculate(data, "amount");
      setMasterDataTemp({ data: data, total });
      setTotalAsset(total);
    } catch (err) {
      if (!err?.response?.data?.is_success) {
        message.error(err?.response?.data?.message || "Failed to save assets");
      } else {
        message.error("Error get assets:", err);
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
            placeholder="Asset Name"
            readOnly={!isEdit}
          />
        </Form.Item>
      )}
    />,
    <Column
      title="Amount"
      dataIndex="amount"
      width={100}
      render={(_, record) => (
        <Form.Item
          name={[record._idx, "amount"]}
          style={{ margin: 0 }}
          rules={[{ required: true, message: "" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={FORMATNUMBER}
            readOnly={!isEdit}
            onChange={() => {
              const total = Calculate(form.getFieldValue("data"), "amount");
              setTotalAsset(total);
            }}
          />
        </Form.Item>
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
              const total = Calculate(form.getFieldValue("data"), "amount");
              setTotalAsset(total);
            }}
          />
        </Form.Item>
      )}
    />,
  ];

  const footer = (
    <InputCurrency
      label="Total Asset: "
      value={totalAsset}
      labelUp={xs}
      readOnly
    />
  );

  return (
    <div style={{ width: "100%" }}>
      <MMFormTable
        title="Assets"
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
