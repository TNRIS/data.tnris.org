import { ShoppingCartOutlined } from "@ant-design/icons";
import { Badge, Button } from "antd";
import { cartAtom, cartOpenAtom } from "../../utilities/atoms/cartAtoms";
import { useRecoilValue, useSetRecoilState } from "recoil";

export function CartIndicator() {
  const cart = useRecoilValue(cartAtom);
  const setCartOpen = useSetRecoilState(cartOpenAtom);

  return (
    <Badge
      offset={[0, 16]}
      size="small"
      count={cart ? Object.keys(cart).length : 0}
    >
      <Button
        onClick={() => setCartOpen((open) => !open)}
        icon={<ShoppingCartOutlined />}
        type="link"
      >
        Cart
      </Button>
    </Badge>
  );
}
