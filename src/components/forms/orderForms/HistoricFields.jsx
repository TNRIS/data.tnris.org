import { Form, Select } from "antd";

const historicImageryFormatOptions = [
  { label: "Paper 8x11", value: "8X11" },
  { label: "Paper 11x17", value: "11x17" },
  { label: "Digital Scan", value: "Scan" },
  { label: "Georeferences", value: "Georeferenced" },
];

export function HistoricFields() {
  return (
    <Form.Item
      label="Historic Imagery Format Options"
      name="Format"
      rules={[{ required: true }]}
      help="select one or more data formats"
    >
      <Select options={historicImageryFormatOptions} mode="multiple" allowClear />
    </Form.Item>
  );
}
