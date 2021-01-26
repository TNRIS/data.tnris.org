import { Col, Row } from "antd";
import { Route, Switch } from "react-router-dom";
import useQuery from "../../utilities/custom-hooks/useQuery";
import { AppMap } from "../AppMap";
import { CatalogList } from "../CatalogList";
import CollectionRoute from "../routes/CollectionRoute";

export function CatalogCollectionRouterContainer(props) {
  const map = useQuery().get("map");

  return (
    <Row id="CatalogCollectionRouterContainer" {...props}>
      {/** Collection Data Pane */}
      <Switch>
        <Route path="/collection">
          <Col
            xs={{ order: 2, span: 24 }}
            md={{ order: 1, span: 10 }}
            className={"DataContainer"}
          >
            <CollectionRoute />
          </Col>
        </Route>
        <Route path="/">
          <Col
            xs={{ order: 2, span: 24 }}
            md={{ order: 1, span: map === "true" ? 10 : 24 }}
            className={`DataContainer ${map === "true" ? '' : "MapNone"}`}
          >
            <CatalogList mapview={map} />
          </Col>
        </Route>
      </Switch>

      {/** Map Pane */}
      <Switch>
        <Route path="/collection">
          <Col
            xs={{ order: 1, span: 24 }}
            md={{ order: 2, span: 14 }}
            className={`AppMapContainer`}
          >
            <AppMap />
          </Col>
        </Route>
        <Route path="/">
          <Col
            className={`AppMapContainer ${map === "true" ? '' : "MapNone"}`}
            xs={{ order: 1, span: map === "true" ? 24 : 0 }}
            md={{ order: 2, span: map === "true" ? 14 : 0 }}
          >
            <AppMap />
          </Col>
        </Route>
        <Route path="*">
          <></>
        </Route>
      </Switch>
    </Row>
  );
}
