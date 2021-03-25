import { Form, Radio } from "antd";
import { DescriptionUpload } from "./DescriptionUpload";

const orderTypeOptions = [
  { label: "Full (Entire Dataset)", value: "Full" },
  { label: "Partial (Described Portion)", value: "Partial" },
];
const descriptionTypeOptions = [
  {
    label: "Shapefile (.kml, .shp)",
    value: "Shapefile",
  },
  {
    label: "Screenshot (.png, .jpeg)",
    value: "Screenshot",
  },
  {
    label: "Describe it (text)",
    value: "Text",
  },
];

export function BaseFields({ form }) {
  return (
    <>
      <Form.Item
        label="Would you like the entire dataset, or just a portion of it?"
        name="Coverage"
        rules={[{ required: true }]}
      >
        <Radio.Group
          options={orderTypeOptions}
          optionType="button"
        />
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues["Coverage"] !== currentValues["Coverage"]
        }
      >
        {({ getFieldValue }) => {
          return getFieldValue("Coverage") === "Partial" ? (
            <Form.Item
              label="How will you describe the extent of the data you need?"
              name="Type"
              rules={[{ required: true }]}
            >
              <Radio.Group
                optionType="button"
                options={descriptionTypeOptions}
              />
            </Form.Item>
          ) : (
            form.setFieldsValue({ "Type": null })
          );
        }}
      </Form.Item>
      <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues["Type"] !== currentValues["Type"]
        }
      >
        {({ getFieldValue }) => (
          <DescriptionUpload description={getFieldValue("Type")} />
        )}
      </Form.Item>
    </>
  );
}
