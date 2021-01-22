// package imports
import { Col, Row } from "antd"

// local imports
import { CollectionList } from '../CollectionList';
import { CatalogMap } from '../CatalogMap';
import useQuery from "../../utilities/custom-hooks/useQuery";
import { Link } from "react-router-dom";

export default function CatalogRoute() {

  const map = useQuery().get("map")
  return (
    <div style={{ height: "calc(100% - 30px)" }}>
      <h2>Catalog Route | { map || "map param not set"}</h2>
      <Link to="/?map=true">Show Map</Link> | <Link to="/?map=false">Hide Map</Link>
      <Row style={{ height: "calc(100% - 30px)" }}>
        <Col
          span={ map === "true" ? 8 : 24}
          style={{
            border: "solid 1px #666",
            height: "100%",
            overflowY: 'scroll',
            overflowX: 'hidden'
          }}
        >
          Collections
          <CollectionList mapview={map}/>
        </Col>
        <Col
          span={map === "true" ? 16  : 0}
          style={{ border: "solid 1px #666" }}
        >
          <CatalogMap/>
        </Col>
      </Row>
    </div>
  );
}
