import { Button, Form, Input, message, Select } from "antd";
import { useState, useEffect } from "react";

import SimpleTable from "../components/SimpleTable";
import Column from "antd/es/table/Column";
import InputCurrency from "../components/InputCurrency";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Calculate } from "../helper/helper";
import { useMoneyManagementContext } from "../context/MoneyManagementContext";
import axios from "axios";
import { BASE_URL } from "../constant/Constant";

export default function Liability() {
  const { totalLiability, setTotalLiability, periodCode, xs } =
    useMoneyManagementContext();

  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();
  const [masterDataTemp, setMasterDataTemp] = useState({});
  const [fetchingData, setFetchingData] = useState(false);

  const deleteRow = (key) => {
    const data = form.getFieldValue("data") || [];
    const newData = data.filter((item) => item.key !== key);
    const total = Calculate(newData);
    setTotalLiability(total);

    form.setFieldsValue({ data: newData });
  };

  /**
   * Inserts a new blank row at the given index (default: at end)
   * @param {number} insertIndex - position to insert new row
   */
  const addRow = (insertIndex = form.getFieldValue("data")?.length || 0) => {
    const data = form.getFieldValue("data") || [];
    const newRow = { name: "", value: "0" };

    const newArr = [...data];
    newArr.splice(insertIndex, 0, newRow);

    // re‑assign keys based on position
    const rekeyed = newArr.map((row, idx) => ({
      ...row,
      key: String(idx + 1),
    }));

    form.setFieldsValue({ data: rekeyed });
  };

  const onSave = async () => {
    try {
      setFetchingData(true);
      const values = await form.validateFields();

      const data = values.data.map((obj, idx) => ({
        ...obj,
        order_no: idx + 1,
      }));

      await axios.put(`${BASE_URL}/liabilities`, {
        period_code: periodCode,
        data,
      });

      setMasterDataTemp({ data: data, total: totalLiability });
      message.success("Liabilities saved successfully!");

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

  const extraButton = [
    ...(isEdit
      ? [
          <Button key="save" type="primary" onClick={onSave}>
            Save
          </Button>,
          <Button key="add" icon={<PlusOutlined />} onClick={() => addRow(0)}>
            Add
          </Button>,
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
        ]
      : []),

    !isEdit && (
      <Button key="edit" onClick={() => setIsEdit((prev) => !prev)}>
        Edit
      </Button>
    ),
  ].filter(Boolean);

  const getData = async () => {
    setFetchingData(true);

    try {
      const res = await axios.get(
        `${BASE_URL}/liabilities?period_code=${periodCode}`
      );
      const data = res.data.data.map((obj, idx) => ({
        ...obj,
        key: `${idx + 1}`,
      }));

      form.setFieldsValue({ data: data });
      const total = Calculate(data);
      setMasterDataTemp({ data: data, total });
      setTotalLiability(total);
    } catch (err) {
      console.error(err);
      if (!err?.response?.data?.is_success) {
        message.error(
          err?.response?.data?.message || "Failed to save liabilities"
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
  }, [periodCode]);

  return (
    <div style={{ width: "100%" }}>
      <Form form={form} layout="inline">
        <Form.List name="data">
          {(fields, { add, remove }) => {
            const dataList = form.getFieldValue("data") || [];

            return (
              <SimpleTable
                title="Liabilities"
                footer={
                  <InputCurrency
                    label="Total Liability: "
                    value={totalLiability}
                    labelUp={xs}
                    readOnly
                  />
                }
                dataSource={dataList.map((row, idx) => ({
                  ...row,
                  _idx: idx,
                }))}
                rowKey="key"
                bordered
                extraButton={extraButton}
                style={{ width: "100%" }}
                loading={fetchingData}
              >
                <Column
                  title="Name"
                  dataIndex="name"
                  width={250}
                  render={(_, record) => (
                    <Form.Item
                      name={[record._idx, "name"]}
                      style={{ margin: 0 }}
                      rules={[{ required: true, message: "" }]}
                    >
                      <Input
                        style={{ width: "100%" }}
                        placeholder="Liability Name"
                        readOnly={!isEdit}
                      />
                    </Form.Item>
                  )}
                />
                <Column
                  title="Value"
                  dataIndex="value"
                  width={250}
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
                />
                {isEdit && (
                  <Column
                    title="Action"
                    dataIndex="action"
                    width={50}
                    render={(_, record) => (
                      <div
                        style={{
                          display: "flex",
                          gap: "1em",
                          justifyContent: "end",
                        }}
                      >
                        <Button
                          icon={<PlusOutlined />}
                          size="small"
                          onClick={() => addRow(record._idx + 1)}
                        >
                          Add
                        </Button>
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          size="small"
                          onClick={() => deleteRow(record.key)}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  />
                )}
              </SimpleTable>
            );
          }}
        </Form.List>
      </Form>
    </div>
  );
}
