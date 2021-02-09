import { Switch } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { constructNewSearchString } from "../../utilities/constructNewSearchString";
import useQueryParam from "../../utilities/custom-hooks/useQueryParam";

export function MapViewSwitch() {
  const history = useHistory();
  const search = useLocation().search;
  const map = useQueryParam().get("map");

  return (
    <Switch
      checkedChildren="hide map"
      unCheckedChildren="show map"
      defaultChecked={false}
      checked={map === "true"}
      onChange={() =>
        history.push({
          pathname: "/",
          search: constructNewSearchString(
            "map",
            map === null || map==="false" ? "false" : "true",
            map === "true" ? "false" : "true",
            search
          ),
        })
      }
    />
  );
}
