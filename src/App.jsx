import { ConfigProvider, theme } from "antd";
import "./App.css";
import Container from "./pages/Container";

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <Container />
    </ConfigProvider>
  );
}

export default App;
