import { Form, Select } from "antd";

export function HardDriveFields({ form, opts }) {
  return (
    opts &&
    opts.length > 1 && (
      <Form.Item
        name="Hard Drive"
        help="If TNRIS provided drive is selected, the final total will include purchase cost of the drive."
      >
        <Select options={opts} />
      </Form.Item>
    )
  );
}
