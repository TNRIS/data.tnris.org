import { Form } from "antd";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";

export function ReviewSubmit({ form }) {
  const recaptchaRef = useRef();
  function setFormRecaptcha(recaptcha) {
    console.log(form, recaptcha);
    form.setFieldsValue({ "recaptcha": recaptcha });
  }
  return (
    <div>
      <Form.Item name="recaptcha" rules={[{ required: true }]}>
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={"6Lf8GP8SAAAAAFx2H53RtfDO18x7S1q_0pGNdmbd"}
          onChange={(v) => setFormRecaptcha(v)}
        />
      </Form.Item>
    </div>
  );
}
