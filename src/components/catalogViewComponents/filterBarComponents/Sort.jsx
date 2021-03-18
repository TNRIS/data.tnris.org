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
      bordered={false}
    >
      <Select.Option value="NEWEST">Newest</Select.Option>
      <Select.Option value="OLDEST">Oldest</Select.Option>
      <Select.Option value="AZ">A to Z</Select.Option>
      <Select.Option value="ZA">Z to A</Select.Option>
    </Select>
  );
}
