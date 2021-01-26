import { BrowserRouter, Route, Switch } from "react-router-dom";
import CartContainer from "../containers/CartContainer";
import { CatalogCollectionLayout } from "../../catalog-collection/CatalogCollectionLayout";
export function RootRouter() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/cart">
          <CartContainer />
        </Route>
        <Route path={["/", "/collection"]}>
          <CatalogCollectionLayout />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
