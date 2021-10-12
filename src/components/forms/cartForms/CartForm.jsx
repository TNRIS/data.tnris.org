import { Button, Form, Progress, Row } from "antd";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { cartAtom, cartOpenAtom } from "../../../atoms/cartAtoms";
import { CartItemList } from "./CartItemList";
import { DeliveryMethodFields } from "./DeliveryMethodFields";
import { HardDriveFields } from "./HardDriveFields";
import { PaymentFields } from "./PaymentFields";
import { PricingSummary } from "./PricingSummary";
import { RequestorDetailsFields } from "./RequestorDetailsFields";
import { ReviewSubmit } from "./ReviewSubmit";
export function CartForm() {
  const [cart, setCart] = useRecoilState(cartAtom);
  const setCartOpen = useSetRecoilState(cartOpenAtom);
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const steps = [
    {
      title: "Cart",
      content: <CartItemList form={form} />,
      validateFields: [],
    },
    {
      title: "Personal Info",
      content: <RequestorDetailsFields form={form} />,
      validateFields: [
        "First Name",
        "Last Name",
        "Address",
        "City",
        "State",
        "Zipcode",
        "Phone Number",
        "Email",
        "Industry",
        "Comment",
      ],
    },
    {
      title: "Delivery Method",
      content: (
        <>
          <DeliveryMethodFields form={form} />
          <HardDriveFields form={form} />
        </>
      ),
      validateFields: ["Delivery Method", "Hard Drive"],
    },
    {
      title: "Payment Method",
      content: <PaymentFields form={form} />,
      validateFields: ["Payment Method"],
    },
    {
      title: "Pricing Summary",
      content: <PricingSummary />,
      validateFields: [],
    },
    {
      title: "Review & Finalize",
      content: <ReviewSubmit form={form} />,
      validateFields: ["recaptcha"],
    },
    {
      title: "Order Completed",
      content: <h1>Order Completed</h1>,
      validateFields: [],
    },
  ];

  useEffect(() => {
    if (cart && (Object.keys(cart).length === 1 || !cart)) {
      setStep(0);
    }
  }, [cart, setStep]);
  //decrement step
  const nextStep = () => {
    setStep((step) => step + 1);
  };
  //increment current step
  const prevStep = () => {
    setStep((step) => step - 1);
  };
  //takes action as argument and performs it if the current steps validateFields are validated successfully.
  //If current field has no validateFields, action is called.
  const validateAction = (action) => {
    if (steps[step].validateFields.length === 0) {
      action();
    } else {
      form
        .validateFields(steps[step].validateFields)
        .then((validation) => {
          action();
        })
        .catch((e) => console.log(e));
    }
  };
  const submitOrderCartForm = async (postData) => {
    let orders = "\n";
    Object.keys(cart).map((collectionId, index) => {
      const dataName = cart[collectionId].name;
      const dataNum = `(${index + 1}) ${dataName}`;
      orders += dataNum;
      orders += "\n";
      orders += `   UUID: ${collectionId}\n`;
      const dataOrder = cart[collectionId];
      orders += `   Coverage: ${dataOrder.coverage}\n`;
      if (dataOrder.formats) {
        orders += `   Formats: ${dataOrder.formats}\n`;
      }
      if (dataOrder.coverage === "Partial") {
        orders += `   Identified By: ${dataOrder.type}\n`;
      }
      if (dataOrder.description) {
        const opts = {
          string: `   Description: ${dataOrder.description}\n`,
          object: `   Description Files:\n ${dataOrder.description
            .map((v, i) => `\t(${i + 1}) File: ${v.filename}\n${v.link}\n`)
            .toString()}`,
        };

        orders += opts[typeof dataOrder.description];
      }
      return orders;
    });
    const formVals = {
      Name: `${postData["First Name"]} ${postData["Last Name"]}`,
      Email: postData["Email"],
      Phone: postData["Phone Number"],
      Address: `${postData["Address"]} ${postData["City"]}, ${postData["State"]}`,
      Organization: postData["Organization"],
      Industry: postData["Industry"],
      Notes: postData["Comment"],
      Delivery: postData["Delivery Method"],
      HardDrive: postData["Hard Drive"],
      Payment: postData["Payment Method"],
      Order: orders,
      form_id: "data-tnris-org-order",
      recaptcha: postData["recaptcha"],
    };

    const url = "https://api.tnris.org/api/v1/contact/submit";
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(formVals),
    };
    const response = await fetch(url, payload);
    const json = await response.json();
    //console.log(json);
    let setTOut;
    let clearTOut = () => {
      clearTimeout(setTOut);
    };
    if (json.status === "success") {
      setStep(steps.length - 1);
      setTOut = () =>
        setTimeout(() => {
          form.resetFields();
          setStep(0);
          setCart({});
        }, 5 * 1000);

      setTOut();
      setCartOpen(false);    
      clearTOut();

    } else {
      setStep(1);
    }
    
    return await json;
  };
  function onSubmit(data) {
    submitOrderCartForm(data);
  }

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={(v) => onSubmit(v)}
        name="data-tnris-org-order"
      >
        <h3>{steps[step].title}</h3>
        <Progress
          percent={((step + 1) / steps.length) * 100}
          showInfo={false}
        ></Progress>
        <br />
        <br />
        {steps.map((s, i) => (
          <div
            key={`${s.title}_${i}`}
            style={i === step ? { display: "block" } : { display: "none" }}
          >
            {s.content}
          </div>
        ))}
        <br />
        <Row justify="space-between">
          <Button onClick={() => prevStep()} disabled={step < 1}>
            {steps[step - 1] ? <span>&#171;&nbsp;</span> : null}
            {steps[step - 1] ? steps[step - 1].title : null}
          </Button>
          {step === steps.length - 2 ? (
            <Button
              htmlType="submit"
              style={{
                background: "green",
                color: "white",
              }}
            >
              {step === steps.length - 2 ? "Submit Order" : "Next"}
            </Button>
          ) : (
            <Button
              onClick={() => validateAction(nextStep)}
              disabled={
                step >= steps.length - 1 ||
                !cart ||
                Object.keys(cart).length === 0
              }
            >
              {steps[step + 1] ? steps[step + 1].title : "Next"}
              <span>&nbsp; &#187;</span>
            </Button>
          )}
        </Row>
      </Form>
    </>
  );
}

export function CartFormStep({ form, title, Content }) {
  return (
    <div>
      <h3>{title}</h3>
      <Content form={form} />
    </div>
  );
}
