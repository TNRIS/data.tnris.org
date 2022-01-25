import { Form } from "antd";
import { useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRecoilValue } from "recoil";
import { cartAtom } from "../../../../atoms/cartAtoms";

const CartToHTML = ({ cart }) => {
  let orders = "\n";
  if (cart && Object.keys(cart).length > 0) {
    Object.keys(cart).forEach((collectionId, index) => {
      const dataName = cart[collectionId].name;
      const dataNum = `(${index + 1}) ${dataName}`;
      orders += dataNum;
      orders += "\n";
      orders += `   UUID: ${collectionId}\n`;
      const dataOrder = cart[collectionId];
      orders += `   Acquisition Date: ${dataOrder.acquisition_date}\n`;
      orders += `   Coverage: ${dataOrder.coverage}\n`;
      if (dataOrder.formats) {
        orders += `   Formats: ${dataOrder.formats}\n`;
      }
      if (dataOrder.coverage === "Partial") {
        orders += `   Identified By: ${dataOrder.type}\n`;
      }
      if (dataOrder.description) {
        switch (typeof dataOrder.description) {
          case "string":
            orders += `   Description: ${dataOrder.description}\n`;
            break;
          case "object":
            orders += `   Description Files:\n ${dataOrder.description
              .map((v, i) => `\t(${i + 1}) File: ${v.filename}\n${v.link}\n`)
              .toString()}`;
            break;
          default:
            orders += `   Description: ${dataOrder.description}\n`;
        }
      }
    });
  }

  return (
    <div style={{ whiteSpace: "break-spaces", paddingBottom: "2rem" }}>
      {orders}
    </div>
  );
};

export function ReviewSubmit({ form }) {
  const cart = useRecoilValue(cartAtom);
  const recaptchaRef = useRef();
  function setFormRecaptcha(recaptcha) {
    form.setFieldsValue({ recaptcha: recaptcha });
  }

  return (
    <div>
      <Form.Item name="recaptcha" rules={[{ required: true }]}>
        <CartToHTML cart={cart} />
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={"6Lf8GP8SAAAAAFx2H53RtfDO18x7S1q_0pGNdmbd"}
          onChange={(v) => setFormRecaptcha(v)}
        />
      </Form.Item>
    </div>
  );
}
