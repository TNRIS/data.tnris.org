import { Descriptions } from "antd";

export function CartItem({ cartItem }) {
  return (
    <Descriptions layout="vertical">
      <Descriptions.Item
        label={
          <h4 style={{ fontVariant: "small-caps", fontWeight: "600" }}>
            coverage
          </h4>
        }
      >
        {cartItem.coverage}
      </Descriptions.Item>
      {cartItem?.formats && (
        <Descriptions.Item
          label={
            <h4 style={{ fontVariant: "small-caps", fontWeight: "600" }}>
              formats
            </h4>
          }
        >
          <ul>
            {cartItem.formats.split(",").map((v) => (
              <li key={`${cartItem.collection_id}_${v}`}>{v}</li>
            ))}
          </ul>
        </Descriptions.Item>
      )}
      <Descriptions.Item
        label={
          <h4 style={{ fontVariant: "small-caps", fontWeight: "600" }}>
            description
          </h4>
        }
      >
        {typeof cartItem.description === "string" && (
          <span>{cartItem.description}</span>
        )}
        {typeof cartItem.description === "object" && (
          <ul>
            {cartItem.description.map((v, i) => (
              <li key={`attachment_${v.filename}_${i}`}>
                <a href={v.link}>{v.filename}, &nbsp;</a>
              </li>
            ))}
          </ul>
        )}
      </Descriptions.Item>
    </Descriptions>
  );
}
