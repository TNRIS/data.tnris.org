// package imports
import { Row } from "antd";

// local imports
import useQueryParam from "../../../utilities/custom-hooks/useQueryParam";

export default function CollectionTabs() {
  return (
    <div style={{ height: "100%" }}>
      <h2>Collection Route | c = {useQueryParam().get("c") || "does not exist"}</h2>
      <Row>Tabs</Row>
    </div>
  );
}
