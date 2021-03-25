// TODO:
// 1. Create Form component
// 2. Add baseForm as child
// 3. Depending on collection passed as prop, determine what fields to render
// 4. Serialize form into schema for cart in localStorage
// 5. Create atom to manage localStorage
// 6. Store in localStorage

import { ShoppingCartOutlined } from "@ant-design/icons";
import { Alert, Button, Form } from "antd";
import { useRef } from "react";
import { addCartItem } from "../../../utilities/cartControllers";
import { BaseFields } from "./BaseFields";
import { HistoricFields } from "./HistoricFields";
import { LidarFields } from "./LidarFields";

export function OrderFormContainer({ collection }) {
  const [form] = Form.useForm();
  const formRef = useRef();
  const parseFormDataToCartItem = (f) => {
    const cartItem = {
      coverage: f.Coverage,
      description: f.Description,
      type: f.Type,
      formats: f.Format.toString()
    }

    return cartItem
  }
  return (
    <div
      style={{
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
        gap: "1rem",
      }}
    >
      <Alert
        showIcon
        type="info"
        message="Is there no download option for this dataset? Is everything you're looking for too large to directly download? Every dataset is available for order directly from TNRIS."
      />
      <br />
      <Form
        form={form}
        ref={formRef}
        name="order-form"
        layout="vertical"
        onFinish={(v) => addCartItem(collection.collection_id, parseFormDataToCartItem(v))}
        scrollToFirstError
      >
        <BaseFields form={form} />
        {collection.category.indexOf("Lidar") !== -1 && <LidarFields />}
        {collection.category.indexOf("Historic_Imagery") !== -1 && (
          <HistoricFields />
        )}

        <br />
        <Form.Item>
          <Button
            block
            size="large"
            htmlType="submit"
            icon={<ShoppingCartOutlined />}
            type="primary"
          >
            Add to Cart
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
