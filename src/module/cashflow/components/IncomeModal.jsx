import { DatePicker, Form, message, Modal, Select } from "antd";
import React, { useEffect, useState } from "react";
import TextArea from "antd/es/input/TextArea";
import moment from "moment";
import { useCashflowContext } from "../../../context/CashflowContext";
import api from "../../../helper/api";
import InputCurrency from "../../../components/InputCurrency";

const IncomeModal = () => {
  const {
    openFormModal,
    setOpenFormModal,
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
        await api.post("/income", {
          ...values,
        });
      } else {
        await api.put(`/income/${modalData?.id}`, {
          ...values,
        });
      }

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
      setOpenFormModal(false);
      setLoading(false);
    }
  };

  const handleOk = () => {
    form.submit();
  };

  const handleCancel = () => {
    setOpenFormModal(false);
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
    if (openFormModal) {
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
        open={openFormModal === 'income'}
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
export default IncomeModal;
