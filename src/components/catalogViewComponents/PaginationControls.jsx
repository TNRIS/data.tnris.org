import { Pagination } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { fetchCatalogCollectionsSelector } from "../../atoms/catalogAtoms";
import { changeParams } from "../../utilities/changeParamsUtil";
import useQueryParam from "../../utilities/customHooks/useQueryParam";

export function CatalogPaginationControls() {
  const history = useHistory();
  const { search } = useLocation();
  const page = useQueryParam().get("pg");
  const increment = useQueryParam().get("inc");
  const { contents } = useRecoilValueLoadable(fetchCatalogCollectionsSelector);

  return (
    <>
      {contents.count < (page - 1) * increment && page > 1
        ? history.push({
            search: changeParams(
              [{ key: "pg", value: 1, ACTION: "set" }],
              search
            ),
          })
        : null}
      <Pagination
        aria-label="pagination"
        size="small"
        responsive
        pageSizeOptions={[12, 24, 60, 120]}
        current={page ? Number(page) : 1}
        pageSize={increment ? Number(increment) : 24}
        onChange={(pg, inc) => {
          if (pg !== Number(page)) {
            history.push({
              search: changeParams(
                [{ key: "pg", value: pg, ACTION: "set" }],
                search
              ),
            });
          }
          if (inc !== Number(increment)) {
            history.push({
              search: changeParams(
                [{ key: "inc", value: inc, ACTION: "set" }],
                search
              ),
            });
          }
        }}
        total={contents.count}
        showTotal={() => (
          <span>
            {page * increment - increment + 1} -{" "}
            {page * increment <= contents.count
              ? page * increment
              : contents.count}{" "}
            of {contents.count}
          </span>
        )}
      />
    </>
  );
}
