import { Route, Switch } from "react-router-dom";
import { CatalogList } from "../components/catalogListComponents/CatalogList";
import CollectionTabsContainer from "../components/collectionTabsComponents/CollectionTabsContainer";

export function LeftPanelRouter() {
  return (
    <Switch>
      <Route path="/collection" exact>
        <CollectionTabsContainer />
      </Route>
      <Route path="/" exact>
        <CatalogList />
      </Route>
      <Route path="*"></Route>
    </Switch>
  );
}
