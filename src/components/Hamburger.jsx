import React, { useState } from "react";
import { Modal, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";

export default function HamburgerModal({ component }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        type="text"
        icon={<MenuOutlined style={{ fontSize: "20px" }} />}
        onClick={() => setVisible(true)}
      />

      <Modal open={visible} footer={null} onCancel={() => setVisible(false)}>
        <div style={{ width: "70%", margin: "auto" }}>{component}</div>
      </Modal>
    </>
  );
}
