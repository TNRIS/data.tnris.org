import { Route, Switch } from "react-router-dom";
import CartContainer from "../components/CartContainer";
import { CatalogCollectionLayout } from "../../catalog-collection/CatalogCollectionLayout";
export function RootRouter() {
  return (
      <Switch>
        <Route path="/cart">
          <CartContainer />
        </Route>
        <Route path={["/", "/collection"]}>
          <CatalogCollectionLayout />
        </Route>
        <Route path="/*">
          <>
            <h2>404 Page Not Found</h2>
          </>
        </Route>
      </Switch>
  );
}
