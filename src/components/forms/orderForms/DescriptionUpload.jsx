import { Form, Input, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";

export function DescriptionUpload({ description }) {
  switch (description) {
    case "Shapefile":
      return <ShapefileField />;
    case "Screenshot":
      return <ScreenshotField />;
    case "Text":
      return <TextField />;
    default:
      return null;
  }
}

const ShapefileField = () => (
  <Form.Item
    label={"Upload shapefile"}
    name={["Description"]}
    rules={[{ required: true }]}
  >
    <Upload.Dragger>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag a .kml or .shp file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Only zipfiles (.zip) accepted. Select a Shapefile or KML within a
        compressed zipfile to upload. Maximum allowed file size is 20 MB. <a href="http://geojson.io/">Don't
        have a shapefile? Draw one here!</a>
      </p>
    </Upload.Dragger>
  </Form.Item>
);

const ScreenshotField = () => (
  <Form.Item
    label={"Upload screenshot"}
    name={["Description"]}
    rules={[{ required: true }]}
  >
    <Upload.Dragger>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag .png or .jpeg file to this area to upload
      </p>
      <p className="ant-upload-hint">
        Select a .png, .jpg, or .jpeg image to upload. Multiple images are
        accepted. Maximum allowed file size is 5 MB.
      </p>
    </Upload.Dragger>
  </Form.Item>
);

const TextField = () => (
  <Form.Item
    label={"Describe the data you need"}
    name={["Description"]}
    rules={[{ required: true }]}
    help="Please describe the portion of data you need in the text box. Providing as much detail as possible will vastly improve the response and turn around time of your order."
  >
    <Input.TextArea />
  </Form.Item>
);
