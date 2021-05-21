import { Descriptions } from "antd";

export function CartItem({ cartItem }) {
  return (
    <Descriptions layout="vertical">
      <Descriptions.Item label={<h4 style={{ fontVariant: "small-caps", fontWeight: "600" }}>coverage</h4>}>
        {cartItem.coverage}
      </Descriptions.Item>
      {cartItem?.formats && (
        <Descriptions.Item label={<h4 style={{ fontVariant: "small-caps", fontWeight: "600" }}>formats</h4>}>
          <ul>
            {cartItem.formats.split(",").map((v) => (
              <li key={`${cartItem.collection_id}_${v}`}>{v}</li>
            ))}
          </ul>
        </Descriptions.Item>
      )}
      <Descriptions.Item label={<h4 style={{ fontVariant: "small-caps", fontWeight: "600" }}>description</h4>}>
        {cartItem.description}
      </Descriptions.Item>
    </Descriptions>
  );
}
