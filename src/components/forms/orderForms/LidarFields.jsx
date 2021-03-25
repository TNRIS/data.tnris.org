import { Form, Select } from "antd";

const lidarFormatOptions = [
  { label: "Digital Elevation Model (DEM)", value: "DEM" },
  { label: "Hypsography", value: "HYPSO" },
  { label: "LAZ Point Cloud (Compressed)", value: "LAZ" },
  { label: "LAS Point Cloud (Uncompress)", value: "LAS" },
  { label: "Breaklines", value: "BREAKLINES" },
];

export function LidarFields() {
  return (
    <Form.Item
      label="Lidar Format Options"
      name="Format"
      rules={[{ required: true }]}
      help="select one or more data formats"
    >
      <Select options={lidarFormatOptions} mode="multiple" allowClear />
    </Form.Item>
  );
}
