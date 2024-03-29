import { Form, Select } from "antd";

const deliveryOptions = [
  { label: "Prepared Zipfile Download (Free, 10GB Max)", value: "ZIP" },
  { label: "USPS ($5 per hard drive)", value: "USPS" },
  { label: "Fedex ($15 per hard drive)", value: "FEDEX" },
  { label: "Pickup", value: "PICKUP" },
];

export function DeliveryMethodFields({ form }) {
  //console.log(form);
  return (
    <Form.Item
      name="Delivery Method"
      help="Listed shipping costs assume TNRIS provided hard drive. This price will vary if delivered on customer supplied hard drive."
      rules={[{ required: true }]}
    >
      <Select options={deliveryOptions} />
    </Form.Item>
  );
}
