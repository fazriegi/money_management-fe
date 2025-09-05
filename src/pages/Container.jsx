import { Route, Routes } from "react-router-dom";
import { MoneyManagementProvider } from "../context/MoneyManagementContext";
import MoneyManagement from "./MoneyManagement";
import Login from "./Login";
import Cashflow from "../module/cashflow/Cashflow";
import { CashflowProvider } from "../context/CashflowContext";

export default function Container() {
  return (
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
        <Route path="/login" element={<Login />} />
        <Route
          path="/money-management"
          element={
            <MoneyManagementProvider>
              <MoneyManagement />
            </MoneyManagementProvider>
          }
        />
      </Routes>
    </div>
  );
}
