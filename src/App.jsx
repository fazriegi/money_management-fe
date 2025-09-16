import {
  Avatar,
  Button,
  ConfigProvider,
  Drawer,
  Grid,
  Layout,
  Menu,
  message,
  Space,
  theme,
  Typography,
} from "antd";
import "./App.css";
import { useState } from "react";
import {
  CloseOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate, Route, Routes } from "react-router-dom";
import Login from "src/pages/Login";
import Cashflow from "src//module/cashflow/Cashflow";
import { CashflowProvider } from "src/context/CashflowContext";
import Home from "src/pages/Home";
import BalanceSheet from "src/module/balance-sheet/BalanceSheet";

const { Header, Content } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

function MainLayout({ children }) {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const { xs } = useBreakpoint();

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("USER"));

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleLogout = () => {
    localStorage.clear();
    message.success("Sign out successful");
    navigate("/login");
  };

  const menuItems = [
    {
      key: "1",
      label: "Home",
      onClick: () => navigate("/"),
    },
    {
      key: "2",
      label: "Cashflow",
      onClick: () => navigate("/cashflow"),
    },
    {
      key: "3",
      label: "Balance Sheet",
      onClick: () => navigate("/balance-sheet"),
    },
  ];

  const sidebarContent = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#141414",
      }}
    >
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {xs && (
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={toggleSidebar}
            style={{ color: "white", marginLeft: "auto" }}
          />
        )}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectable={false}
        items={menuItems}
        onClick={({ key }) => {
          if (xs) setSidebarVisible(false);
        }}
        style={{ flex: 1, borderRight: 0, backgroundColor: "#141414" }}
      />
      <div
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectable={false}
          style={{ backgroundColor: "#141414" }}
          items={[
            {
              key: "logout",
              icon: <LogoutOutlined />,
              label: "Sign Out",
              onClick: handleLogout,
            },
          ]}
        />
      </div>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          padding: "0 16px",
          backgroundColor: "#141414",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        {xs && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={toggleSidebar}
            style={{
              fontSize: "16px",
            }}
          />
        )}

        <Space>
          <Avatar size="default" icon={<UserOutlined />} />
          <Text strong>{user?.user?.name}</Text>
        </Space>
      </Header>

      {/* Sidebar for desktop */}
      {!xs && (
        <Layout.Sider
          width={200}
          style={{
            position: "fixed",
            left: 0,
            height: "100vh",
            zIndex: 9,
          }}
        >
          {sidebarContent}
        </Layout.Sider>
      )}

      {/* Drawer for mobile */}
      {xs && (
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setSidebarVisible(false)}
          open={sidebarVisible}
          bodyStyle={{ padding: 0 }}
          width={250}
          style={{ zIndex: 1000 }}
        >
          {sidebarContent}
        </Drawer>
      )}

      {/* Main Content */}
      <Layout
        style={{
          marginLeft: !xs ? 110 : 0,
          transition: "margin-left 0.2s",
        }}
      >
        <Content
          style={{
            minHeight: 280,
            borderRadius: 8,
          }}
        >
          {children}
        </Content>
      </Layout>

      {/* Mobile overlay when sidebar is open */}
      {xs && sidebarVisible && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 999,
          }}
          onClick={() => setSidebarVisible(false)}
        />
      )}
    </Layout>
  );
}

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      {!isLoginPage ? (
        <MainLayout>
          <div id="container">
            <Routes>
              <Route
                path="/cashflow"
                element={
                  <CashflowProvider>
                    <Cashflow />
                  </CashflowProvider>
                }
              />
              <Route path="/" element={<Home />} />
              <Route path="/balance-sheet" element={<BalanceSheet />} />
            </Routes>
          </div>
        </MainLayout>
      ) : (
        <div id="container">
          <Routes>
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      )}
    </ConfigProvider>
  );
}

export default App;
