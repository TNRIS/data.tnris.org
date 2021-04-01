import { Form, Radio } from "antd";

const paymentOptions = [
  { label: "Credit Card", value: "Credit Card" },
  { label: "Check", value: "Check" },
  { label: "Fedex Account", value: "Fedex Account" },
  { label: "Pay at Pickup", value: "Pay at Pickup" },
];

const disabledOption = (deliveryValue) => {
  switch(true){
    case deliveryValue === "ZIP" || deliveryValue === "USPS":
      return [0,1]
    case deliveryValue === "FEDEX":
      return [0,1,2]
    case deliveryValue === "PICKUP":
      return [0,1,3]
    default: 
      return [0,1,2,3]
  }
};
export function PaymentFields({ form }) {
  const selectable = disabledOption(form.getFieldValue("Delivery Method"));
  console.log(selectable)
  return (
    <>
      <Form.Item
        name="Payment Method"
        help="Once a quote for your order has been completed, TNRIS will contact you for payment details."
        rules={[{required: true}]}
      >
        <Radio.Group>
          {paymentOptions.map((v, i) => (
            <Radio
              key={`${v}_${i}`}
              value={v.value}
              style={{ display: "block" }}
              disabled={!selectable.includes(i)}
            >
              {v.label}
            </Radio>
          ))}
        </Radio.Group>
      </Form.Item>
    </>
  );
}
