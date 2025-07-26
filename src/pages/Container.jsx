import { MoneyManagementProvider } from "../context/MoneyManagementContext";
import MoneyManagement from "./MoneyManagement";

export default function Container() {
  return (
    <div id="container">
      <MoneyManagementProvider>
        <MoneyManagement />
      </MoneyManagementProvider>
    </div>
  );
}
