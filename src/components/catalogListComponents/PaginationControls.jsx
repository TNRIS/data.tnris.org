import { Pagination } from "antd";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { fetchCatalogCollectionsSelector } from "../../utilities/atoms/catalogAtoms";
import { constructNewSearchString } from "../../utilities/constructNewSearchString";

import useQueryParam from "../../utilities/custom-hooks/useQueryParam";

export function CatalogPaginationControls() {
  const history = useHistory();
  const search = useLocation().search;
  const page = useQueryParam().get("pg");
  const increment = useQueryParam().get("inc");
  /* const page = useRecoilValue(catalogPageSelector);
    const increment = useRecoilValue(catalogIncrementSelector); */
  const { contents } = useRecoilValueLoadable(fetchCatalogCollectionsSelector);

  useEffect(() => {
    if (!search) {
      history.push({
        pathname: "/",
        search: "?page=1&inc=24&map=false",
      });
    }
  }, [search, history]);
  return (
    <>
      {(contents.count % (page * increment)) <= 1 && page > 1
        ? history.push({
            pathname: "/",
            search: constructNewSearchString("pg", page, 1, search),
          })
        : null}
      <Pagination
        size="small"
        showQuickJumper
        responsive
        pageSizeOptions={[12, 24, 60, 120]}
        current={page ? Number(page) : 1}
        pageSize={increment ? Number(increment) : 24}
        onChange={(pg, inc) => {
          if (pg !== Number(page)) {
            history.push({
              pathname: "/",
              search: constructNewSearchString("pg", page, pg, search),
            });
          }
          if (inc !== Number(increment)) {
            history.push({
              pathname: "/",
              search: constructNewSearchString("inc", increment, inc, search),
            });
          }
        }}
        total={contents.count}
      />
    </>
  );
}
