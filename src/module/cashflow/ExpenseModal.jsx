import { Button, DatePicker, Form, Modal, Select } from "antd";
import React, { useContext, useState } from "react";
import { useCashflowContext } from "../../context/CashflowContext";
import InputCurrency from "../../components/InputCurrency";
import TextArea from "antd/es/input/TextArea";

const ExpenseModal = () => {
  const { isExpenseModalOpen, setIsExpenseModalOpen } = useCashflowContext();

  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const handleOk = () => {
    form.submit()
    // setIsExpenseModalOpen(false);
  };

  const handleCancel = () => {
    setIsExpenseModalOpen(false);
  };

  return (
    <>
      <Modal
        title="Expense"
        open={isExpenseModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          form={form}
          style={{ marginTop: "1em" }}
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
            <Select placeholder="Choose" />
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
          <Form.Item label="Notes" name="note">
            <TextArea placeholder="Notes" maxLength={255} showCount />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
export default ExpenseModal;
