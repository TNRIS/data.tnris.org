import { Col, Row } from "antd";
import { Route, Switch } from "react-router-dom";
import useQuery from "../../utilities/custom-hooks/useQuery";
import { AppMap } from "../AppMap";
import { CollectionList } from "../CollectionList";
import CollectionRoute from "../routes/CollectionRoute";

export function CatalogCollectionRouterContainer(props) {
  const map = useQuery().get("map");
  const CollectionListCSS = {
    wrapper: {
      "@media screen and (maxWidth: 600px)": {
        height: "70%",
      },
      "@media screen and (minWidth: 601px)": {
        height: "100%",
      },
      height: "100%",
      overflow: "hidden scroll",
      margin: 0,
    },
  };
  return (
    <Row id="Catalog-Collection-Router-Container" {...props}>
      {/** Collection Data Pane */}
      <Switch>
        <Route path="/collection">
          <Col
            xs={{ order: 2, span: 24 }}
            md={{ order: 1, span: 10 }}
          >
            <CollectionRoute />
          </Col>
        </Route>
        <Route path="/">
          <Col
            xs={{ order: 2, span: 24 }}
            md={{ order: 1, span: map === "true" ? 10 : 24 }}
            style={CollectionListCSS.wrapper}
          >
            <CollectionList mapview={map} />
          </Col>
        </Route>
      </Switch>

      {/** Map Pane */}
      <Switch>
        <Route path="/collection">
          <Col xs={{ order: 1, span: 14 }} md={{ order: 2, span: 14 }}>
            <AppMap />
          </Col>
        </Route>
        <Route path="/">
          <Col
            xs={{ order: 1, span: map === "true" ? 14 : 0 }}
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
