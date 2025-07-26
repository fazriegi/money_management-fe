import { Table } from "antd";
import React from "react";

export default function SimpleTable({
  title = "",
  footer = null,
  style = {},
  dataSource = [],
  extraButton = [],
  children,
  ...props
}) {
  const isUseTitle = Boolean(title);

  const renderTitle = () => (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h3 style={{ margin: 0, lineHeight: 1.5 }}>{title}</h3>
      {Array.isArray(extraButton) && extraButton.length > 0 && (
        <div style={{ display: "flex", gap: "10px" }}>
          {extraButton.map((btn, idx) => (
            <React.Fragment key={idx}>{btn}</React.Fragment>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Table
      bordered
      dataSource={dataSource}
      pagination={false}
      style={style}
      title={isUseTitle ? renderTitle : undefined}
      footer={() => footer || undefined}
      scroll={{ x: "max-content" }}
      {...props}
    >
      {children}
    </Table>
  );
}
