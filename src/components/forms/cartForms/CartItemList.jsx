import { Collapse, Empty } from "antd";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { cartAtom } from "../../../utilities/atoms/cartAtoms";
import { CartItem } from "./CartItem";
import { DeleteCartItem } from "./DeleteCartItem";

export function CartItemList() {
  const cart = useRecoilValue(cartAtom);
  return (
    <>
      {cart && Object.keys(cart).length < 1 && (
        <Empty description="There are no datasets in your cart." />
      )}
      {cart && Object.keys(cart).length > 0 && (
        <Collapse>
          {Object.keys(cart).map((itemKey, index) => (
            <Collapse.Panel
              key={itemKey}
              header={
                <Link to={`/collection?c=${cart[itemKey].collection_id}`}>
                  {cart[itemKey].name}
                </Link>
              }
              extra={
                <DeleteCartItem collection_id={cart[itemKey].collection_id} />
              }
            >
              <CartItem cartItem={cart[itemKey]} key={itemKey + "_" + index} />
            </Collapse.Panel>
          ))}
        </Collapse>
      )}
    </>
  );
}
