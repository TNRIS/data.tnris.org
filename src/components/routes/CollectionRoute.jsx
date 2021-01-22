// package imports
import { Col, Row } from "antd";

// local imports
import useQuery from "../../utilities/custom-hooks/useQuery";
import { CollectionMap } from '../CollectionMap';

export default function CollectionRoute() {
  return (
    <div style={{ height: "100%" }}>
      <h2>Collection Route | c = {useQuery().get("c") || "does not exist"}</h2>
      <Row style={{height: "100%"}}>
        <Col
          span={8}
          style={{
            border: 'solid 1px #666',
            height: "100%"
          }}>Tabs
        </Col>
        <Col
          span={16}
          style={{
            border: 'solid 1px #666'
          }}
        >
          <CollectionMap/>
        </Col>
      </Row>
    </div>
  );
}
