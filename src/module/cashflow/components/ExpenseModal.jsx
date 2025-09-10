import { DatePicker, Form, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import InputCurrency from "src/components/InputCurrency";
import { useCashflowContext } from "src/context/CashflowContext";
import api from "src/helper/api";

const ExpenseModal = () => {
  const { openFormModal, setOpenFormModal, modalData, setRefetchCashflow } =
    useCashflowContext();

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

      message.success(`success ${modalData?.type} expense`)
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
      setOpenFormModal(null);
      setLoading(false);
    }
  };

  const handleOk = () => {
    form.submit();
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/expense/${modalData?.id}`);

      message.success("success delete expense")
      setRefetchCashflow((prev) => prev + 1);
    } catch (err) {
      if (!err?.response?.data?.is_success) {
        message.error(
          err?.response?.data?.message || `Failed to delete expense`
        );
      } else {
        message.error(`Error delete expense:`, err);
      }
    } finally {
      setOpenFormModal(null);
      setLoading(false);
      form.resetFields();
    }
  };

  const handleCancel = () => {
    Modal.warning({
      title: 'Delete',
      content: 'Are you sure want to delete this expense?',
      onOk: handleDelete,
    });
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
    if (openFormModal === 'expense') {
      form.resetFields();
      getDataCategory();

      if (modalData?.type === "edit") {
        getData();
      }
    }
  }, [openFormModal, modalData]);

  return (
    <>
      <Modal
        title="Expense"
        open={openFormModal === "expense"}
        onOk={handleOk}
        okText="Save"
        onCancel={handleCancel}
        cancelText="Delete"
        cancelButtonProps={{
          danger: true,
          disabled: modalData?.type === 'add',
        }}
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
