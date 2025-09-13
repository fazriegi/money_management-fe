import { UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Typography } from "antd";
import Password from "antd/es/input/Password";
import axios from "axios";
import { BASE_URL } from "../constant/Constant";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (formData) => {
    setIsSubmit(true);
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        username: formData.username,
        password: formData.password,
      });

      const respBody = response?.data;

      if (respBody?.is_success) {
        localStorage.setItem("USER", JSON.stringify(respBody?.data));
        navigate("/cashflow");
      }
    } catch (err) {
      message.error(
        `${err?.response?.data?.status}: ${err?.response?.data?.message}`
      );
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <div id="login-container">
      <div className="glass-container">
        <Form
          name="basic"
          id="login-form"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Typography.Title style={{ marginBottom: "2em" }}>
            Sign In
          </Typography.Title>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              placeholder="Username"
              prefix={<UserOutlined />}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item label={null}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%" }}
              loading={isSubmit}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
