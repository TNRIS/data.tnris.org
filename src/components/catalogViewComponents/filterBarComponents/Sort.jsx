import { Select } from "antd";
import { useHistory, useLocation } from "react-router";
import { changeParams } from "../../../utilities/changeParamsUtil";
import useQueryParam from "../../../utilities/custom-hooks/useQueryParam";

export function Sort() {
  const history = useHistory();
  const { search } = useLocation();
  const sortParam = useQueryParam().get("sort");
  const sort = sortParam ? sortParam : "NEWEST";
  return (
    <Select
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
    >
      <Select.Option value="NEWEST">Sort By:  Newest</Select.Option>
      <Select.Option value="OLDEST">Sort By:  Oldest</Select.Option>
      <Select.Option value="AZ">Sort By:  A to Z</Select.Option>
      <Select.Option value="ZA">Sort By:  Z to A</Select.Option>
    </Select>
  );
}
