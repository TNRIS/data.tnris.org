import { Button } from "antd";
import { useHistory, useLocation } from "react-router";
import { changeParams } from "../../../utilities/changeParamsUtil";

export function ClearAllFilters() {
  const history = useHistory();
  const { search } = useLocation();
  return (
    <Button
      type="link"
      onClick={() => {
        history.push({
          search: changeParams([
            { key: "availability", value: null, ACTION: "delete" },
            { key: "category", value: null, ACTION: "delete" },
            { key: "file_type", value: null, ACTION: "delete" },
            { key: "dates", value: null, ACTION: "delete" },
            { key: "sort", value: null, ACTION: "delete" },
          ], search),
        });
      }}
    >
      Clear all filters &#10005;
    </Button>
  );
}
