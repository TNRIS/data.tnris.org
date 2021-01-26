import { Route, Switch } from "react-router-dom";
import { CatalogList } from "../containers/CatalogList";
import CollectionRoute from "../containers/CollectionTabContainer";

export function DataPanelRouter() {
  return (
    <Switch>
      <Route path="/collection">
        <CollectionRoute />
      </Route>
      <Route path="/">
        <CatalogList />
      </Route>
    </Switch>
  );
}
