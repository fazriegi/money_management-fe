import { Button, DatePicker, Form, message, Modal, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useCashflowContext } from "../../context/CashflowContext";
import InputCurrency from "../../components/InputCurrency";
import TextArea from "antd/es/input/TextArea";
import api from "../../helper/api";
import moment from "moment";

const ExpenseModal = () => {
  const {
    isExpenseModalOpen,
    setIsExpenseModalOpen,
    modalData,
    setRefetchCashflow,
  } = useCashflowContext();

  const [form] = Form.useForm();
  const [listCategory, setListCategory] = useState([]);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const now = moment();

      values.date = moment(values.date)
        .hour(now.hour())
        .minute(now.minute())
        .second(now.second())
        .format("YYYY-MM-DD HH:mm:ss");

      if (modalData?.type === "add") {
        await api.post("/expense", {
          ...values,
        });
      } else {
        await api.put(`/expense/${modalData?.id}`, {
          ...values,
        });
      }

      setRefetchCashflow((prev) => prev + 1);
    } catch (err) {
      if (!err?.response?.data?.is_success) {
        message.error(
          err?.response?.data?.message || `Failed to ${modalData?.type} expense`
        );
      } else {
        message.error(`Error ${modalData?.type} expense:`, err);
      }
    } finally {
      setIsExpenseModalOpen(false);
      setLoading(false);
    }
  };

  const handleOk = () => {
    form.submit();
    // setIsExpenseModalOpen(false);
  };

  const handleCancel = () => {
    setIsExpenseModalOpen(false);
    form.resetFields();
  };

  const getData = async () => {
    try {
      const res = await api.get(`/expense/${modalData?.id ?? 0}`);

      const respData = res.data.data;
      form.setFieldsValue({
        ...respData,
        date: respData.date ? moment(respData.date) : null,
      });
    } catch (err) {
      if (!err?.response?.data?.is_success) {
        message.error(err?.response?.data?.message || "Failed to get expense");
      } else {
        message.error("Error get expense:", err);
      }
    }
  };
  const getDataCategory = async () => {
    try {
      const res = await api.get(`/expense/category`);

      const respData = res.data.data;
      setListCategory(respData);
    } catch (err) {
      if (!err?.response?.data?.is_success) {
        message.error(
          err?.response?.data?.message || "Failed to get list category"
        );
      } else {
        message.error("Error get list category:", err);
      }
    }
  };

  useEffect(() => {
    if (isExpenseModalOpen) {
      form.resetFields();
      getDataCategory();

      if (modalData?.type === "edit") {
        getData();
      }
    }
  }, [isExpenseModalOpen, modalData]);

  return (
    <>
      <Modal
        title="Expense"
        open={isExpenseModalOpen}
        onOk={handleOk}
        okText="Save"
        onCancel={handleCancel}
        loading={loading}
      >
        <Form
          form={form}
          style={{ marginTop: "1em", marginBottom: "3em" }}
          onFinish={onFinish}
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 16,
          }}
        >
          <Form.Item
            label="Category"
            name="category_id"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Choose"
              options={listCategory.map((c) => ({
                label: c.name,
                value: c.id,
              }))}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            label="Date"
            name="date"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Value"
            name="value"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputCurrency />
          </Form.Item>
          <Form.Item label="Notes" name="notes">
            <TextArea placeholder="Notes" maxLength={255} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ExpenseModal;
