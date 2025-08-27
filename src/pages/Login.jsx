import { UserOutlined } from "@ant-design/icons";
import { Button, Input, message, Typography } from "antd";

const Login = () => {
  const handleLogin = () => {
    message.error("Implement me!");
  };

  return (
    <div id="login-container">
      <div className="glass-container">
        <div id="login-form">
          <Typography.Title style={{ marginBottom: "2em" }}>
            Sign In
          </Typography.Title>
          <Input
            placeholder="Username"
            prefix={<UserOutlined />}
            size="large"
            style={{ marginBottom: "1em" }}
          />
          <Input.Password placeholder="Password" size="large" />
          <Button
            type="primary"
            style={{ marginTop: "2em", width: "100%" }}
            size="large"
            onClick={handleLogin}
          >
            Sign In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
