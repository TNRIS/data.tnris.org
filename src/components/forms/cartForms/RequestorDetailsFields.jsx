import { Form, Input, Select } from "antd";
import { industriesList, stateNames } from "../commonFieldOptions";

export function RequestorDetailsFields({ form }) {
  return (
    <>
      <Form.Item
        label="First Name"
        name="First Name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="Last Name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Address" name="Address" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="City" name="City" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="State" name="State" rules={[{ required: true }]}>
        <Select
          filterOption={(input, option) =>
            option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 ||
            option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showSearch={true}
          options={stateNames}
        />
      </Form.Item>
      <Form.Item label="Zipcode" name="Zipcode" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Phone Number"
        name="Phone Number"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="Email" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Industry" name="Industry" rules={[{ required: true }]}>
        <Select
          filterOption={(input, option) =>
            option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          showSearch={true}
        >
          {industriesList.map((v, i) => (
            <Select.Option key={`${v}_${i}`} label={v} value={v}>
              {v}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="General notes or comments about this order"
        name="Comment"
      >
        <Input.TextArea />
      </Form.Item>
    </>
  );
}
