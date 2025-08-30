import { Button, Form } from "antd";
import SimpleTable from "./SimpleTable";
import Column from "antd/es/table/Column";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import HamburgerModal from "./Hamburger";

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
  xs,
  ...props
}) {
  const onEditButton = (
    <div
      style={{
        display: "flex",
        gap: 10,
        flexDirection: xs ? "column" : "row",
        width: xs ? "100%" : "auto",
      }}
    >
      {isEdit ? (
        <>
          <Button key="save" type="primary" onClick={onSave}>
            Save
          </Button>

          <Button key="add" icon={<PlusOutlined />} onClick={() => addRow(0)}>
            Add
          </Button>
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>
        </>
      ) : (
        <Button key="edit" onClick={() => setIsEdit((prev) => !prev)}>
          Edit
        </Button>
      )}
    </div>
  );

  const extraButton = [
    xs ? <HamburgerModal component={onEditButton} /> : onEditButton,
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

    const newRow = {}
    if (data.length > 0) {
      const firstRow = data[0];

      Object.keys(firstRow).forEach(key => {
        if (key !== '_idx') {
          newRow[key] = null;
        }
      });
    }

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
                      gap: "0.5em",
                      justifyContent: "end",
                      flexDirection: xs ? "column" : "row",
                      width: xs ? "100%" : "auto",
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
