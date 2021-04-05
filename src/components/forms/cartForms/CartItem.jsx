import { Descriptions } from "antd";

export function CartItem({ cartItem }) {
  return (
    <Descriptions>
      <Descriptions.Item label="Coverage">
        {cartItem.coverage}
      </Descriptions.Item>
      {cartItem?.formats && (
        <Descriptions.Item label="Formats">
          <ul>
            {cartItem.formats.split(",").map((v) => (
              <li key={`${cartItem.collection_id}_${v}`}>{v}</li>
            ))}
          </ul>
        </Descriptions.Item>
      )}
      <Descriptions.Item label="Description">
        {cartItem.description}
      </Descriptions.Item>
    </Descriptions>
  );
}
