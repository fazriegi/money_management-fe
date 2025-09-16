import { Grid, Tabs, Typography } from "antd";
import Summary from "./components/Summary";
import Asset from "./components/Asset";
import Liability from "./components/Liability";

const { useBreakpoint } = Grid;

export default function BalanceSheet() {
  const { xs } = useBreakpoint();

  return (
    <div style={{ marginTop: "3em" }}>
      <div
        style={
          !xs
            ? {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "1em",
              }
            : { margin: "2em" }
        }
      >
        <Typography.Title level={xs ? 4 : 3} style={{ margin: 0 }}>
          Balance Sheet
        </Typography.Title>
      </div>
      <div
        style={
          !xs
            ? {
                margin: "1em",
              }
            : { margin: "2em" }
        }
      >
        <Tabs
          defaultActiveKey="summary"
          items={[
            {
              label: `Summary`,
              key: "summary",
              children: <Summary />,
            },
            {
              label: `Asset`,
              key: "asset",
              children: <Asset />,
            },
            {
              label: `Liability`,
              key: "liability",
              children: <Liability />,
            },
          ]}
        />
      </div>
    </div>
  );
}
