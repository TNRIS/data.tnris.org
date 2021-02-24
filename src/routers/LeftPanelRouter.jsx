import { useEffect } from "react";
import { Route, Switch, useHistory, useLocation } from "react-router-dom";
import { CatalogList } from "../components/catalogViewComponents/CatalogList";
import CollectionTabsContainer from "../components/collectionViewComponents/TabsContainer";
import { changeParams } from "../utilities/changeParamsUtil";
import useQueryParam from "../utilities/custom-hooks/useQueryParam";

export function LeftPanelRouter() {
  const history = useHistory();
  const {search, pathname} = useLocation();
  const page = useQueryParam().get("pg");

  useEffect(() => {
    if ( (!page) && pathname === "/") {
      history.push({
        search: changeParams([
          {key:"pg", value: 1, ACTION: "set"},
          {key:"inc", value: 24, ACTION: "set"},
          {key: "c", value: null, ACTION: "delete"}
        ], search)
      }, search);
    }
    if(pathname === "/"){
      changeParams([
        {key: "c", value: null, ACTION: "delete"}
      ], search)
    }
  }, [page,history,search,pathname]);

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
