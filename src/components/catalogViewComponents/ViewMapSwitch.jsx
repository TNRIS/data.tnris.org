import { Switch } from "antd";
import { useHistory } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { searchString } from "../../atoms/urlFactoryAtoms";
import useQueryParam from "../../utilities/customHooks/useQueryParam";
import { changeParams } from "../../utilities/changeParamsUtil";

export function ViewMapSwitch() {
  const history = useHistory();
  const currentSearchString = useRecoilValue(searchString);
  const map = useQueryParam().get("map");
  return (
    <Switch
      checkedChildren="Hide Map"
      unCheckedChildren="Show Map"
      defaultChecked={false}
      checked={map === "true"}
      onClick={() =>
        history.push({
          search: changeParams(
            [
              {
                key: "map",
                value: map === "true" ? "false" : "true",
                ACTION: "set",
              },
            ],
            currentSearchString
          ),
        })
      }
    />
  );
}
