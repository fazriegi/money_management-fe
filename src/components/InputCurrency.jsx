import { InputNumber } from "antd";
import { CURRENCY } from "../constant/Constant";

const InputCurrency = ({
  label = "",
  defaultValue = 0,
  inputStyle = {},
  ...props
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        ...props?.style,
      }}
    >
      {label !== "" && <h3 style={{ margin: 0, lineHeight: 1.5 }}>{label}</h3>}
      <div style={{ flex: 1 }}>
        <InputNumber
          {...props}
          defaultValue={defaultValue}
          formatter={(value) =>
            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          style={{
            width: "100%",
            backgroundColor: "#f9f9f9",
            cursor: "default",
            color: "#000",
            ...inputStyle,
          }}
          className="right-align-input"
          addonBefore={CURRENCY}
          parser={(value) =>
            value === null || value === void 0
              ? void 0
              : value.replace(/\$\s?|(,*)/g, "")
          }
        />
      </div>
    </div>
  );
};
export default InputCurrency;
