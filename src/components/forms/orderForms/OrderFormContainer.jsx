import { ShoppingCartOutlined } from "@ant-design/icons";
import { Alert, Button, Form } from "antd";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { cartAtom, cartOpenAtom } from "../../../atoms/cartAtoms";
import { uploadFilesToS3 } from "../../../utilities/formHelpers/fileUploadHelpers";
import { BaseFields } from "./BaseFields";
import { HistoricFields } from "./HistoricFields";
import { LidarFields } from "./LidarFields";

export function OrderFormContainer({ collection }) {
  const [cart, setCart] = useRecoilState(cartAtom);
  const setCartOpen = useSetRecoilState(cartOpenAtom);
  const [form] = Form.useForm();
  const formRef = useRef();
  const [uploadStatus, setUploadStatus] = useState(null);

  useEffect(() => {
    let nullifyStatusOnTimer;
    const cleanupStatusOnTimeout = () => {
      clearTimeout(nullifyStatusOnTimer)
    };

    if(uploadStatus !== null){
      nullifyStatusOnTimer = () => setTimeout(() => setUploadStatus(null), 5000)
      nullifyStatusOnTimer()
      cleanupStatusOnTimeout()
    }
    //console.log(uploadStatus)
  }, [uploadStatus])

  const parseFormDataToCartItem = async (f) => {
    let files = null;
    if (f.Type === "Screenshot" || f.Type === "Mapfile") {
      files = await uploadFilesToS3(
        collection.collection_id,
        f.Description,
        f.Type,
        setUploadStatus
      );
    }
    const cartItem = {
      collection_id: collection.collection_id,
      name: collection.name,
      coverage: f.Coverage,
      description: files && files.length ? files : f.Description,
      type: f.Type,
      formats: f.Format ? f.Format.toString() : undefined,
    };

    return cartItem;
  };
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
      {cart && cart[collection.collection_id] && (
        <>
          <Alert
            showIcon
            type="success"
            message="This item has been added to your cart"
          />
          <br />
          <Button
            block
            size="large"
            htmlType="submit"
            icon={<ShoppingCartOutlined />}
            type="primary"
            onClick={() => setCartOpen(true)}
          >
            Complete checkout
          </Button>
        </>
      )}
      {(!cart || !cart[collection.collection_id]) && (
        <Form
          form={form}
          ref={formRef}
          name="order-form"
          layout="vertical"
          onFinish={async (v) =>
            setCart({
              ...cart,
              [collection.collection_id]: await parseFormDataToCartItem(v),
            })
          }
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
              {uploadStatus && <div>{uploadStatus.status}</div>}
              {!uploadStatus && <span>Add to Cart</span>}
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}
