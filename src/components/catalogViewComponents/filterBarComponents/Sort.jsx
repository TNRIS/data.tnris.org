import { Select } from "antd";
import { useHistory, useLocation } from "react-router";
import { changeParams } from "../../../utilities/changeParamsUtil";
import useQueryParam from "../../../utilities/customHooks/useQueryParam";

export function Sort() {
  const history = useHistory();
  const { search } = useLocation();
  const sortParam = useQueryParam().get("sort");
  const sort = sortParam ? sortParam : "NEWEST";
  return (
    <Select
      aria-label="sort results"
      value={sort}
      onChange={(v) => {
        history.push({
          search: changeParams(
            [
              {
                key: "sort",
                value: v,
                ACTION: "set",
              },
            ],
            search
          ),
        });
      }}
      bordered={true}
      options={[
        {
          label: "Sort by: NEWEST",
          value: "NEWEST",
        },
        {
          label: "Sort by: OLDEST",
          value: "OLDEST",
        },
        {
          label: "Sort by: A to Z",
          value: "AZ",
        },
        {
          label: "Sort by: Z to A",
          value: "ZA",
        },
      ]}
    />
  );
}
