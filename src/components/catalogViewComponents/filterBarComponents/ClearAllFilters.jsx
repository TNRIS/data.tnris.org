import { Button } from "antd";
import { useHistory, useLocation } from "react-router";
import { changeParams } from "../../../utilities/changeParamsUtil";

export function ClearAllFilters() {
  const history = useHistory();
  const { search } = useLocation();
  const clearFiltersKeys = [
    "availability",
    "category",
    "file_type",
    "dates",
    "sort",
  ];

  return (
    <>
      {clearFiltersKeys.filter((v) => search.includes(v)).length > 0 && (
        <Button
          type="link"
          onClick={() => {
            history.push({
              search: changeParams(
                clearFiltersKeys.map((k) => {
                  return { key: k, value: null, ACTION: "delete" };
                }),
                search
              ),
            });
          }}
        >
          Clear all filters &#10005;
        </Button>
      )}
      {  clearFiltersKeys.filter(v => search.includes(v)).length < 1 &&
      null
}
    </>
  );
}
