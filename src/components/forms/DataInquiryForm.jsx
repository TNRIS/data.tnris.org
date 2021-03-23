import { Alert, Button, Form, Input, Result, Select } from "antd";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { validationMessages } from "./validationMessages";

const softwareList = [
  "ArcMap",
  "ENVI",
  "ERDAS",
  "Global Mapper",
  "Integraph",
  "LP360",
  "Microstation",
  "PostGIS",
  "QGIS",
  "Other",
];

export function DataInquiryForm({
  collectionId,
  collectionName,
  collectionCategory,
  collectionAcquisitionDate,
}) {
  const [responseState, setResponseState] = useState(null);
  const [form] = Form.useForm();
  const recaptchaRef = useRef();

  const submitContactForm = async (postData) => {
    const formVals = {
      name: postData["First name"] + postData["Last name"],
      email: postData["Email"],
      software: postData["Software"],
      message: postData["Message"],
      form_id: "data-tnris-org-inquiry",
      uuid: collectionId,
      collection: collectionName,
      category: collectionCategory,
      acquisition_date: collectionAcquisitionDate,
      recaptcha: postData["Recaptcha"],
    };

    const url = "http://localhost:8000/api/v1/contact/submit";
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(formVals),
    };
    const response = await fetch(url, payload);
    const json = await response.json();
    setResponseState(await json);
    return await json;
  };

  return (
    <>
      {responseState !== null && (
        <Result
          status={responseState.status}
          title={responseState.message}
          extra={[
            <Button
              type="primary"
              onClick={() => {
                setResponseState(null);
                form.resetFields();
              }}
            >
              Okay
            </Button>,
          ]}
        />
      )}
      {responseState === null && (
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
            gap: "1rem",
          }}
        >
          <Alert
            message="Notice"
            description={
              <span>
                For questions about the <strong>{collectionName} </strong>
                dataset, please complete the form below. Orders for this data
                cannot be submitted via this form.
                <strong>
                  <br/><br/>To order this dataset, please visit the Custom Order tab.
                </strong>
              </span>
            }
            type="info"
            showIcon
          />
          <br />
          <Form
            form={form}
            validateMessages={validationMessages}
            onFinish={(v) => {
              setResponseState(submitContactForm(v));
              console.log(v);
            }}
            name="data-ntis-org-inquiry"
            layout="vertical"
            scrollToFirstError
          >
            <div
              style={{
                display: "grid",
                gap: ".5rem",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <Form.Item
                label={"First name"}
                name={["First name"]}
                style={{ paddingRight: "1rem" }}
                rules={[{ required: true }]}
              >
                <Input placeholder="First name"></Input>
              </Form.Item>
              <Form.Item
                label={"Last name"}
                name={["Last name"]}
                rules={[{ required: true }]}
              >
                <Input placeholder="Last name"></Input>
              </Form.Item>
            </div>
            <Form.Item
              label="Email Address"
              name={["Email"]}
              rules={[
                {
                  required: true,
                  type: "email",
                },
              ]}
            >
              <Input placeholder="Email"></Input>
            </Form.Item>
            <Form.Item
              label="Software"
              name={["Software"]}
              rules={[{ required: true }]}
            >
              <Select placeholder="Select software">
                {softwareList.map((v, i) => (
                  <Select.Option key={v + "_" + i}>{v}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Comment"
              rules={[{ required: true }]}
              name={["Message"]}
            >
              <Input.TextArea />
            </Form.Item>
            <Form.Item name={["Recaptcha"]} rules={[{ required: true }]}>
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={"6Lf8GP8SAAAAAFx2H53RtfDO18x7S1q_0pGNdmbd"}
              />
            </Form.Item>
            <Form.Item>
              <Button block htmlType="submit" type="primary">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </>
  );
}
