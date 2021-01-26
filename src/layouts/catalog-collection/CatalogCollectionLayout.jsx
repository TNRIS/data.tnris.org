import { Col, Row } from "antd";
import { useEffect } from "react";
import useQueryParam from "../../utilities/custom-hooks/useQueryParam";
import { AppMap } from "./containers/AppMapContainer";
import { DataPanelRouter } from "./routers/DataPanelRouter";

export function CatalogCollectionLayout(props) {
  const mapParam = useQueryParam().get("map");

  const hideMap = () =>
    (mapParam === "false" || mapParam == null) &&
    window.location.pathname === "/"
      ? "HideMap"
      : "";
  const expandData = () =>
    (mapParam === "false" || mapParam == null) &&
    window.location.pathname === "/";

  useEffect(() => {
    console.log(mapParam, hideMap());
  });
  return (
    <Row id="CatalogCollectionLayout">
      <Col
        xs={{ order: 2, span: 24 }}
        md={{ order: 1, span: expandData() ? 24 : 12 }}
        lg={{ span: expandData() ? 24 : 10 }}
        className={`DataContainer ${hideMap()}`}
      >
        <DataPanelRouter />
      </Col>
      <Col
        xs={{ order: 1, span: 24 }}
        md={{ order: 1, span: 12 }}
        lg={{ span: 14 }}
        className={`AppMapContainer ${hideMap()}`}
      >
        <AppMap />
      </Col>
    </Row>
  );
}
