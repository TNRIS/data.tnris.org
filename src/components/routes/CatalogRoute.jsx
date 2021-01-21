import { Col, Row } from "antd"
import useQuery from "../../utilities/custom-hooks/useQuery";

export default function CatalogRoute() {

    const map = useQuery().get("map")
  return (
    <div style={{ height: "100%" }}>
      <h2>Catalog Route | { map || "map param not set"}</h2>
      <Row style={{ height: "100%" }}>
        <Col span={ map === "true" ? 8 : 24} style={{ border: "solid 1px #666", height: "100%" }}>
          Collections
        </Col>
        <Col span={map === "true" ? 16 : 0} style={{ border: "solid 1px #666" }}>
          Map
        </Col>
      </Row>
    </div>
  );
}
