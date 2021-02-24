import { Col, Row } from "antd";
import { LeftPanelRouter } from "../../routers/LeftPanelRouter";
import useQueryParam from "../../utilities/custom-hooks/useQueryParam";
import { MapContainer } from "../MapContainer";

export function CatalogCollectionLayout(props) {
  const mapParam = useQueryParam().get("map");

  const hideMap = () =>
    (mapParam === "false" || mapParam == null) &&
    window.location.pathname === "/"

  return (
    <Row id="CatalogCollectionLayout">
      <Col
        xs={{ order: 2, span: 24 }}
        md={{ order: 2, span: 24 }}
        lg={{ order: 1, span: hideMap() ? 24 : 10 }}
        className={`LeftPanelContainer${hideMap() ? " HideMap" : ""}`}
      >
        <LeftPanelRouter />
      </Col>
      <Col
        xs={{ order: 1, span: 24 }}
        md={{ order: 1, span: 24 }}
        lg={{ span: 14 }}
        className={`MapContainer${hideMap() ? " HideMap" : ""}`}
      >
        <MapContainer />
      </Col>
    </Row>
  );
}
