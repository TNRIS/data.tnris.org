import { Col, Row } from "antd";
import useQueryParam from "../../utilities/custom-hooks/useQueryParam";
import { MapContainer } from "../MapContainer";
import { LeftPanelRouter } from "../../routers/LeftPanelRouter";

export function CatalogCollectionLayout(props) {
  const mapParam = useQueryParam().get("map");

  const hideMap = () =>
    (mapParam === "false" || mapParam == null) &&
    window.location.pathname === "/"

  return (
    <Row id="CatalogCollectionLayout">
      <Col
        xs={{ order: 2, span: 24 }}
        md={{ order: 1, span: hideMap() ? 24 : 12 }}
        lg={{ span: hideMap() ? 24 : 10 }}
        className={`DataContainer${hideMap() ? " HideMap" : ""}`}
      >
        <LeftPanelRouter />
      </Col>
      <Col
        xs={{ order: 1, span: 24 }}
        md={{ order: 1, span: 12 }}
        lg={{ span: 14 }}
        className={`MapContainer${hideMap() ? " HideMap" : ""}`}
      >
        <MapContainer />
      </Col>
    </Row>
  );
}
