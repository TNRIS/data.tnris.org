import { Form, Radio } from "antd";

const hardDriveOptions = [
  { label: "TNRIS Provided Hard Drive (1TB)", value: "TNRIS_HDD" },
  { label: "TNRIS Provided Flash Drive (64GB)", value: "TNRIS_FLASH" },
  { label: "Customer Provided Hard Drive", value: "CUSTOMER_PROVIDED" },
];

const disabledOption = (deliveryValue) => {
  switch (true) {
    case deliveryValue === "ZIP":
      return [];
    default:
      return [0, 1, 2];
  }
};

export function HardDriveFields({ form }) {
  const selectable = disabledOption(form.getFieldValue("Delivery Method"));

  return (
    <>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues["Delivery Method"] !== currentValues["Delivery Method"]
        }
      >
        {({ getFieldValue }) => {
          return getFieldValue("Delivery Method") !== "ZIP" ? (
            <Form.Item
              name="Hard Drive"
              help="If TNRIS provided drive is selected, the final total will include purchase cost of the drive."
              rules={[{ required: true }]}
            >
              <Radio.Group>
                {hardDriveOptions.map((v, i) => (
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
          ) : (
            form.setFieldsValue({ "Hard Drive": "none" })
          );
        }}
      </Form.Item>
    </>
  );
}
