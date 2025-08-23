import { InputNumber } from "antd";
import { CURRENCY, FORMATNUMBER } from "../constant/Constant";

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
      {label !== "" && <h4 style={{ margin: 0, lineHeight: 1.5 }}>{label}</h4>}
      <div style={{ flex: 1 }}>
        <InputNumber
          {...props}
          defaultValue={defaultValue}
          formatter={FORMATNUMBER}
          style={{
            width: "100%",
            cursor: "default",
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
