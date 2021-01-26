// package imports
import { Row } from "antd";

// local imports
import useQuery from "../../utilities/custom-hooks/useQuery";

export default function CollectionRoute() {
  return (
    <div style={{ height: "100%" }}>
      <h2>Collection Route | c = {useQuery().get("c") || "does not exist"}</h2>
      <Row>Tabs</Row>
    </div>
  );
}
