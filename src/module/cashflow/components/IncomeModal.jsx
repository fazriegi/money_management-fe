import { Button, DatePicker, Form, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import InputCurrency from "src/components/InputCurrency";
import { useCashflowContext } from "src/context/CashflowContext";
import api from "src/helper/api";

const IncomeModal = () => {
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
        await api.post("/income", {
          ...values,
        });
      } else {
        await api.put(`/income/${modalData?.id}`, {
          ...values,
        });
      }

      message.success(`success ${modalData?.type} income`);
      setRefetchCashflow((prev) => prev + 1);
    } catch (err) {
      if (!err?.response?.data?.is_success) {
        message.error(
          err?.response?.data?.message || `Failed to ${modalData?.type} income`
        );
      } else {
        message.error(`Error ${modalData?.type} income:`, err);
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
      await api.delete(`/income/${modalData?.id}`);

      message.success("success delete income");
      setRefetchCashflow((prev) => prev + 1);
    } catch (err) {
      if (!err?.response?.data?.is_success) {
        message.error(
          err?.response?.data?.message || `Failed to delete income`
        );
      } else {
        message.error(`Error delete income:`, err);
      }
    } finally {
      setOpenFormModal(null);
      setLoading(false);
      form.resetFields();
    }
  };

  const onDelete = () => {
    Modal.confirm({
      title: "Delete",
      content: "Are you sure want to delete this expense?",
      onOk: handleDelete,
      okText: "Delete",
      okButtonProps: {
        danger: true,
      },
      cancelText: "Cancel",
    });
  };

  const handleCancel = () => {
    setOpenFormModal(null);
    form.resetFields();
  };

  const getData = async () => {
    try {
      const res = await api.get(`/income/${modalData?.id ?? 0}`);

      const respData = res.data.data;
      form.setFieldsValue({
        ...respData,
        date: respData.date ? moment(respData.date) : null,
      });
    } catch (err) {
      if (!err?.response?.data?.is_success) {
        message.error(err?.response?.data?.message || "Failed to get income");
      } else {
        message.error("Error get income:", err);
      }
    }
  };

  const getDataCategory = async () => {
    try {
      const res = await api.get(`/income/category`);

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
    if (openFormModal === "income") {
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
        title="Income"
        open={openFormModal === "income"}
        onOk={handleOk}
        okText="Save"
        onCancel={handleCancel}
        loading={loading}
        footer={[
          <Button
            key="delete"
            onClick={onDelete}
            danger
            disabled={modalData?.type === "add"}
          >
            Delete
          </Button>,
          <Button key="customOk" type="primary" onClick={handleOk}>
            Save
          </Button>,
        ]}
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
export default IncomeModal;
