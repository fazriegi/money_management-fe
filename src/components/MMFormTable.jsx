import { Button, Form, Input, message, Select } from "antd";
import { useState, useEffect } from "react";

import SimpleTable from "./SimpleTable";
import Column from "antd/es/table/Column";
import InputCurrency from "./InputCurrency";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Calculate } from "../helper/helper";
import { useMoneyManagementContext } from "../context/MoneyManagementContext";
import axios from "axios";
import { BASE_URL } from "../constant/Constant";

export default function MMFormTable({
  title,
  form,
  columns,
  footer,
  disableAction,
  onSave,
  onCancel,
  isEdit,
  setIsEdit,
  ...props
}) {
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

  const deleteRow = (key) => {
    const data = form.getFieldValue("data") || [];
    const newData = data.filter((item) => item.key !== key);

    form.setFieldsValue({ data: newData });
  };

  /**
   * Inserts a new blank row at the given index (default: at end)
   * @param {number} insertIndex - position to insert new row
   */
  const addRow = (insertIndex = form.getFieldValue("data")?.length || 0) => {
    const data = form.getFieldValue("data") || [];
    const newRow = { name: "", value: "0", type: null };

    const newArr = [...data];
    newArr.splice(insertIndex, 0, newRow);

    // re‑assign keys based on position
    const rekeyed = newArr.map((row, idx) => ({
      ...row,
      key: String(idx + 1),
    }));

    form.setFieldsValue({ data: rekeyed });
  };

  return (
    <Form form={form} layout="inline">
      <Form.List name="data">
        {(fields, { add, remove }) => {
          const dataList = form.getFieldValue("data") || [];

          return (
            <SimpleTable
              title={title}
              footer={footer}
              dataSource={dataList.map((row, idx) => ({
                ...row,
                _idx: idx,
              }))}
              rowKey="key"
              bordered
              style={{ width: "100%" }}
              extraButton={extraButton}
              {...props}
            >
              {columns.map((column) => column)}
              <Column
                title="Action"
                dataIndex="action"
                width={100}
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
                      disabled={disableAction}
                    >
                      Add
                    </Button>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                      onClick={() => deleteRow(record.key)}
                      disabled={disableAction}
                    >
                      Delete
                    </Button>
                  </div>
                )}
              />
            </SimpleTable>
          );
        }}
      </Form.List>
    </Form>
  );
}
