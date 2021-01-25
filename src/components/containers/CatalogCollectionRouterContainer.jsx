import { Col, Row } from "antd";
import { Route, Switch } from "react-router-dom";
import useQuery from "../../utilities/custom-hooks/useQuery";
import { AppMap } from "../AppMap";
import { CollectionList } from "../CollectionList";
import CollectionRoute from "../routes/CollectionRoute";

export function CatalogCollectionRouterContainer(props) {
  const map = useQuery().get("map");

  return (
    <Row id="Catalog-Collection-Router-Container" {...props}>
      {/** Collection Data Pane */}
      <Switch>
        <Route path="/collection">
          <CollectionRoute />
        </Route>
        <Route path="/">
          <CollectionList mapview={map} />
        </Route>
      </Switch>

      {/** Map Pane */}
      <Switch>
        <Route path="/collection">
          <Col xs={{ order: 1, span: 14 }} lg={{ order: 2, span: 14 }}>
            <AppMap />
          </Col>
        </Route>
        <Route path="/">
          <Col xs={{ order: 1, span: map === "true" ? 14 : 0 }} lg={{ order: 2, span: map === "true" ? 14 : 0 }}>
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
