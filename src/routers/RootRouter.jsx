import { useEffect } from "react";
import { Route, Switch, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import CartContainer from "../components/CartContainer";
import { CatalogCollectionLayout } from "../components/layouts/CatalogCollectionLayout";
import { searchString } from "../utilities/atoms/urlFactoryAtoms";
export function RootRouter() {
  const location = useLocation()
  const [search, setSearch] = useRecoilState(searchString)

  useEffect(() => {
    setSearch(location.search)
  }, [location, setSearch])

  useEffect(() =>{
    console.log(search)
  }, [search])


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
