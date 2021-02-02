import { Route, Switch } from "react-router-dom";
import { CatalogList } from "../components/CatalogList";
import CollectionTabs from "../components/CollectionTabs";

export function DataPanelRouter() {
  return (
    <Switch>
      <Route path="/collection" exact>
        <CollectionTabs />
      </Route>
      <Route path="/" exact>
        <CatalogList />
      </Route>
      <Route path="*"></Route>
    </Switch>
  );
}
