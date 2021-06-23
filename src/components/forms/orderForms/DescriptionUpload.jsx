import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Upload } from "antd";
import { useState } from "react";

const ShpTxt = () => (
  <>
    <p className="ant-upload-hint">
      Only zipfiles (.zip) accepted. Select a shapefile (.shp) or KML (.kml)
      within a compressed zipfile to upload. Maximum allowed file size is 20 MB.
      <br />
      <a href="http://geojson.io/">Don't have a shapefile? Draw one here!</a>
    </p>
  </>
);
const ImgTxt = () => (
  <>
    <p className="ant-upload-hint">
      Select a .png, .jpg, or .jpeg image to upload. Multiple (5 max) images are
      accepted. Maximum allowed file size is 5 MB.
    </p>
  </>
);

export function DescriptionUpload({ description }) {
  switch (description) {
    case "Shapefile":
      return <FileUploadField description={description} />;
    case "Screenshot":
      return <FileUploadField description={description} />;
    case "Text":
      return <TextField />;
    default:
      return null;
  }
}

const FileUploadField = ({ description }) => {
  const [fileList, setFileList] = useState([]);

  const onRemove = (file) => {
    setFileList((currentFileList) => {
      const idx = currentFileList.indexOf(file);
      const newList = currentFileList.slice();
      newList.splice(idx, 1);
      return newList;
    });
  };
  const beforeUpload = async (file) => {
    setFileList((currentFileList) => {
      return [...currentFileList, file];
    });
  };

  return (
    <Form.Item
      label={"Upload description"}
      name={["Description"]}
      rules={[{ required: true }]}
      getValueFromEvent={({ fileList }) => {
        //console.log(fileList);
        return fileList;
      }}
    >
      <Upload
        fileList={fileList}
        customRequest={() => null}
        beforeUpload={beforeUpload}
        onRemove={onRemove}
        accept={
          description === "Shapefile"
            ? ".zip,.rar,.7zip"
            : "image/png, image/jpeg"
        }
        maxCount={description === "Shapefile" ? 1 : 5}
      >
        <Button icon={<UploadOutlined />}>Select File</Button>
        {description === "Shapefile" ? <ShpTxt /> : <ImgTxt />}
      </Upload>
    </Form.Item>
  );
};

const TextField = () => (
  <Form.Item
    label={"Describe the data you need in words"}
    name={["Description"]}
    rules={[{ required: true }]}
    help="Please describe the portion of data you need in the text box. Providing as much detail as possible will vastly improve the response and turn around time of your order."
  >
    <Input.TextArea />
  </Form.Item>
);
