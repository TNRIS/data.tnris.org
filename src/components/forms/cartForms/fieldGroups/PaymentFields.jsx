import { Form, Select } from "antd";
import { useEffect } from "react";

const paymentOptions = [
  { label: "Credit Card", value: "Credit Card" },
  { label: "Check", value: "Check" },
  { label: "Fedex Account", value: "Fedex Account" },
  { label: "Pay at Pickup", value: "Pay at Pickup" },
];

const disabledOption = (deliveryValue) => {
  switch (true) {
    case deliveryValue === "ZIP":
      return [];
    case deliveryValue === "USPS":
      return [0, 1];
    case deliveryValue === "FEDEX":
      return [0, 1, 2];
    case deliveryValue === "PICKUP":
      return [0, 1, 3];
    default:
      return [0, 1, 2, 3];
  }
};
export function PaymentFields({ form }) {
  const deliveryMethod = form.getFieldValue("Delivery Method");
  const selectable = disabledOption(deliveryMethod);

  useEffect(() => {
    if (deliveryMethod === "ZIP") {
      form.setFieldsValue({ "Payment Method": "N/A" });
    }
  });

  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, currentValues) =>
        prevValues["Delivery Method"] !== currentValues["Delivery Method"]
      }
    >
      {deliveryMethod === "ZIP" && (
        <div>
          <strong>
            Pre-prepared ZIP files are provided free of charge and delivered to
            you by email. Please proceed without selecting a payment method.
          </strong>
        </div>
      )}
      <Form.Item
        name="Payment Method"
        help="Once a quote for your order has been completed, TNRIS will contact you for payment details."
        rules={[{ required: true }]}
      >
        <Select>
          {paymentOptions.map((v, i) => (
            <Select.Option
              key={`${v}_${i}`}
              value={v.value}
              style={{ display: "block" }}
              disabled={!selectable.includes(i)}
            >
              {v.label}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form.Item>
  );
}
