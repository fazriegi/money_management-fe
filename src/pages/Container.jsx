import { Route, Routes } from "react-router-dom";
import { MoneyManagementProvider } from "../context/MoneyManagementContext";
import MoneyManagement from "./MoneyManagement";

export default function Container() {
  return (
    <div id="container">
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
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
