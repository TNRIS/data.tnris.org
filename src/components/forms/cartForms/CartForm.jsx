import { Button, Form, message, Progress, Row } from "antd";
import { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { useRecoilState } from "recoil";
import { cartAtom } from "../../../atoms/cartAtoms";
import { submitOrderCartForm, validateCartStep } from "./cartActions";
import { Cart } from "./fieldGroups/Cart";
import { DeliveryMethodFields } from "./fieldGroups/DeliveryMethodFields";
import { HardDriveFields } from "./fieldGroups/HardDriveFields";
import { PaymentFields } from "./fieldGroups/PaymentFields";
import { PricingSummary } from "./fieldGroups/PricingSummary";
import { RequestorDetailsFields } from "./fieldGroups/RequestorDetailsFields";
import { ReviewSubmit } from "./fieldGroups/ReviewSubmit";

const StepNav = ({ handlePrev, handleNext, stepIdx, steps }) => {
  return (
    <Row justify="space-between">
      <Button onClick={handlePrev} disabled={stepIdx === 0}>
        {steps[stepIdx - 1] ? (
          <>
            <span>&#171;&nbsp;</span> {steps[stepIdx - 1].title}
          </>
        ) : null}
      </Button>
      {stepIdx >= 0 && stepIdx < steps.length - 2 && (
        <Button onClick={handleNext} disabled={stepIdx === steps.length - 1}>
          {steps[stepIdx + 1] ? (
            <>
              {steps[stepIdx + 1].title} <span>&nbsp; &#187;</span>
            </>
          ) : null}
        </Button>
      )}
      {stepIdx === steps.length - 2 && (
        <Button
          type="primary"
          htmlType="submit"
          disabled={stepIdx !== steps.length - 2}
        >
          {stepIdx === steps.length - 2 ? "Submit Order" : null}
        </Button>
      )}
    </Row>
  );
};
export function CartForm() {
  const [cart, setCart] = useRecoilState(cartAtom);
  const [form] = Form.useForm();
  const [stepIdx, setStepIdx] = useState(0);
  const [hardDriveOptions, setHardDriveOptions] = useState([]);

  const submitMutation = useMutation(submitOrderCartForm, {
    onError: (error, variables, context) => {
      message.error(
        "Error submitting order. Please check your submission for errors and try again."
      );
      setStepIdx(0);
      console.log(error)
    },
    onSuccess: (data, error, variables, context) => {
      message.success("Order submitted successfully");
      setStepIdx(steps.length - 1);
      setCart({});
      setTimeout(() => {
        form.resetFields()
        submitMutation.reset();
        setStepIdx(0);
      }, 3000);
    },
  });

  const steps = [
    {
      title: "Cart",
      content: <Cart form={form} />,
      validationFields: [],
    },
    {
      title: "Personal Info",
      content: <RequestorDetailsFields form={form} />,
      validationFields: [
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
          <HardDriveFields form={form} opts={hardDriveOptions} />
        </>
      ),
      validationFields: ["Delivery Method", "Hard Drive"],
    },
    {
      title: "Payment Method",
      content: <PaymentFields form={form} />,
      validationFields: ["Payment Method"],
    },
    {
      title: "Pricing Summary",
      content: <PricingSummary />,
      validationFields: [],
    },
    {
      title: "Review & Finalize",
      content: <ReviewSubmit form={form} />,
      validationFields: ["recaptcha"],
    },
    {
      title: "Order Completed",
      content: <h1>Order Completed</h1>,
      validationFields: [],
    },
  ];

  //resets step to step 1 if cart is empty
  useEffect(() => {
    if (cart && (Object.keys(cart).length === 1 || !cart)) {
      setStepIdx(0);
    }
  }, [cart, setStepIdx]);

  const handlePrev = () => setStepIdx((step) => (step > 0 ? step - 1 : step));
  const handleNext = () =>
    setStepIdx((step) => (step < steps.length - 1 ? step + 1 : step));

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onValuesChange={(changed) => {
          if (Object.keys(changed).includes("Delivery Method")) {
            if (changed["Delivery Method"] === "ZIP") {
              form.setFieldsValue({ "Hard Drive": "N/A" });
              setHardDriveOptions([{ label: "N/A", value: "N/A" }]);
            } else {
              form.setFieldsValue({ "Hard Drive": undefined });
              setHardDriveOptions([
                {
                  label: "TNRIS Provided Hard Drive (1TB)",
                  value: "TNRIS_HDD",
                },
                {
                  label: "TNRIS Provided Flash Drive (64GB)",
                  value: "TNRIS_FLASH",
                },
                {
                  label: "Customer Provided Hard Drive",
                  value: "CUSTOMER_PROVIDED",
                },
              ]);
            }
          }
        }}
        onFinish={(data) =>
          submitMutation.mutate({ postData: data, cart: cart })
        }
        name="data-tnris-org-order"
      >
        <h3>{steps[stepIdx].title}</h3>
        <Progress
          percent={((stepIdx + 1) / steps.length) * 100}
          showInfo={false}
        ></Progress>
        <br />
        <br />
        {steps.map((s, i) => (
          <div
            key={`${s.title}_${i}`}
            style={i === stepIdx ? { display: "block" } : { display: "none" }}
          >
            {s.content}
          </div>
        ))}
        <br />
        {(submitMutation.isIdle || submitMutation.isError) && (
          <StepNav
            handleNext={() =>
              validateCartStep(form, steps[stepIdx], handleNext)
            }
            handlePrev={handlePrev}
            steps={steps}
            stepIdx={stepIdx}
          />
        )}
      </Form>
    </>
  );
}
