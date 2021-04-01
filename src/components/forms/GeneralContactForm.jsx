import { Button, Form, Input, Result, Select } from "antd";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { phoneRegex } from "../../utilities/regexHelpers/regexHelpers";
import { validationMessages } from "./validationMessages";

const industriesList = [
  "Agriculture",
  "Cartography",
  "Conservation",
  "Construction",
  "Consulting",
  "Education",
  "Emergency Management",
  "Environmental",
  "Forestry",
  "Government",
  "Insurance",
  "Law Enforcement",
  "Oil and Gas",
  "Public Health",
  "Retail",
  "Utilities",
  "Urban Planning",
  "Other",
];

export function GeneralContactForm({ onSuccessConfirm }) {
  const [responseState, setResponseState] = useState(null);
  const [form] = Form.useForm();
  const recaptchaRef = useRef();

  const submitContactForm = async (postData) => {
    const formVals = {
      Name: postData["First name"] + postData["Last name"],
      Email: postData["Email"],
      Phone: postData["Phone"],
      Address: postData["Address"],
      Organization: postData["Organization"],
      Industry: postData["Industry"],
      question_or_comments: postData["Question"],
      form_id: "contact",
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
                if (responseState.status === "success") {
                  form.resetFields();
                  if (onSuccessConfirm) {
                    onSuccessConfirm();
                  }
                }
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
          }}
        >
          <Form
            form={form}
            validateMessages={validationMessages}
            onFinish={(v) => submitContactForm(v)}
            name="general-contact-form"
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
            <div
              style={{
                display: "grid",
                gap: ".5rem",
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <Form.Item
                label="Phone number"
                name={["Phone"]}
                help="Phone number must be formatted like 555-555-5555"
                rules={[
                  {
                    required: true,
                    pattern: phoneRegex,
                  },
                ]}
              >
                <Input placeholder="Phone"></Input>
              </Form.Item>
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
            </div>

            <Form.Item label="Street address" name={["Address"]}>
              <Input placeholder="Address"></Input>
            </Form.Item>
            <Form.Item
              label="Industry"
              name={["Industry"]}
              rules={[{ required: true }]}
            >
              <Select placeholder="Select industry of work">
                {industriesList.map((v, i) => (
                  <Select.Option key={v + "_" + i}>{v}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Organization"
              name={["Organization"]}
              rules={[{ required: true }]}
            >
              <Input placeholder="Organization"></Input>
            </Form.Item>
            <Form.Item
              label="Comment"
              rules={[{ required: true }]}
              name={["Question"]}
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
              <Button block size="large" htmlType="submit" type="primary">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </>
  );
}
