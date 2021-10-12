import { DeleteOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useRecoilState } from "recoil";
import { cartAtom } from "../../../atoms/cartAtoms";

export function DeleteCartItem({ collection_id }) {
  const [cart, setCart] = useRecoilState(cartAtom);
  return (
    <Button
      danger
      type="link"
      icon={<DeleteOutlined />}
      onClick={() => {
        let newCart = {...cart};
        delete newCart[collection_id];
        // repopulate cart with new value
        setCart(newCart);
      }}
    >
      Remove from cart
    </Button>
  );
}
