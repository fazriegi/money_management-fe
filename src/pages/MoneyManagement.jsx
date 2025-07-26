import { useEffect, useState } from "react";
import { Button, DatePicker, Form, Input, Select } from "antd";
import dayjs from "dayjs";
import Period from "../components/Period";
import SimpleTable from "../components/SimpleTable";
import Column from "antd/es/table/Column";
import InputCurrency from "../components/InputCurrency";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const dataIncome = [
  {
    key: "1",
    name: "Salary",
    value: "300000",
    type: "passive",
  },
  {
    key: "2",
    name: "Jim Green",
    value: "1256000",
    type: "active",
  },
  {
    key: "3",
    name: "Joe Black",
    value: "120000",
    type: "passive",
  },
];

const MoneyManagement = () => {
  const [period, setPeriod] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [form] = Form.useForm();

  const getPeriodDate = (date) => {
    // start period date every 27
    const startDate = date.date(27).format("DD/MM/YYYY");
    const endDate = date.add(1, "month").date(26).format("DD/MM/YYYY");

    setPeriod(`${startDate} - ${endDate}`);
  };

  const adjustDate = (selectedDate) => {
    const periodStart = selectedDate.subtract(1, "month").date(27);
    const periodEnd = selectedDate.date(26);

    if (
      (selectedDate.isSame(periodStart) || selectedDate.isAfter(periodStart)) &&
      (selectedDate.isSame(periodEnd) || selectedDate.isBefore(periodEnd))
    ) {
      return periodStart;
    }
    return selectedDate;
  };

  const today = adjustDate(dayjs());

  useEffect(() => {
    getPeriodDate(today);
  }, []);

  const changeDate = (date) => {
    const selectedDate = adjustDate(date);
    const formattedDate = selectedDate.format("MMM_YYYY").toLowerCase(); // to send to backend

    getPeriodDate(selectedDate);
  };

  const deleteRow = (key) => {
    const data = form.getFieldValue("income") || [];
    const newData = data.filter((item) => item.key !== key);

    form.setFieldsValue({ income: newData });
  };

  /**
   * Inserts a new blank row at the given index (default: at end)
   * @param {number} insertIndex - position to insert new row
   */
  const addRow = (insertIndex = form.getFieldValue("income")?.length || 0) => {
    const data = form.getFieldValue("income") || [];
    const newRow = { name: "", value: "0", type: null };

    const newArr = [...data];
    newArr.splice(insertIndex, 0, newRow);

    // re‑assign keys based on position
    const rekeyed = newArr.map((row, idx) => ({
      ...row,
      key: String(idx + 1),
    }));

    form.setFieldsValue({ income: rekeyed });
  };

  const onSave = () => {
    setIsEdit((prev) => !prev);
    form.validateFields().then((values) => {
      console.log("All rows:", values.income);
    });
  };

  const extraButton = [
    // if isEdit is true, this will be the Save button element; otherwise it’s false
    isEdit && (
      <Button key="save" type="primary" onClick={onSave}>
        Save
      </Button>
    ),

    // always include the Edit button
    <Button key="edit" onClick={() => setIsEdit((prev) => !prev)}>
      {isEdit ? "Cancel" : "Edit"}
    </Button>,
  ]
    // then strip out any “false” entries:
    .filter(Boolean);

  useEffect(() => {
    form.setFieldsValue({ income: dataIncome });
  }, []);

  return (
    <div id="money-management">
      <header>
        <Period style={{ visibility: "hidden" }} period={period} />
        <DatePicker
          picker="month"
          format="MMM YYYY"
          onChange={changeDate}
          defaultValue={today}
        />
        <Period period={period} />
      </header>
      <section>
        <h2 style={{ fontWeight: "bold" }}>Cashflow</h2>
        <Form form={form} layout="inline">
          <Form.List name="income">
            {(fields, { add, remove }) => {
              const dataList = form.getFieldValue("income") || [];

              return (
                <SimpleTable
                  title="Income"
                  dataSource={dataList.map((row, idx) => ({
                    ...row,
                    _idx: idx,
                  }))}
                  rowKey="key"
                  bordered
                  extraButton={extraButton}
                >
                  <Column
                    title="Type"
                    dataIndex="type"
                    width={50}
                    render={(_, record) => (
                      <Form.Item
                        name={[record._idx, "type"]}
                        style={{ margin: 0 }}
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
                  />
                  <Column
                    title="Name"
                    dataIndex="name"
                    width={250}
                    render={(_, record) => (
                      <Form.Item
                        name={[record._idx, "name"]}
                        style={{ margin: 0 }}
                      >
                        <Input
                          style={{ width: "100%" }}
                          placeholder="Income Name"
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
                      >
                        <InputCurrency
                          style={{ width: "100%" }}
                          readOnly={!isEdit}
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
      </section>
    </div>
  );
};

export default MoneyManagement;
