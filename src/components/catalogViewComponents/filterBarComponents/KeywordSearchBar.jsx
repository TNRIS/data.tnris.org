import { Input } from "antd";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { changeParams } from "../../../utilities/changeParamsUtil";
import useQueryParam from "../../../utilities/customHooks/useQueryParam";

export function KeywordSearchBar() {
  const history = useHistory();
  const search = useLocation().search;
  const param = useQueryParam().get("s");
  const [searchbar, setSearchbar] = useState(param);

  useEffect(() => {
    // Clear searchbar text if param is null
    if (!param) {
      setSearchbar(null);
    }
  }, [param, setSearchbar]);
  return (
    <>
      <Input.Search
        allowClear
        placeholder="Search collections by keyword"
        value={searchbar}
        onChange={(e) => {
          setSearchbar(e.target.value);
          if (!e.target.value) {
            history.push({
              pathname: "/",
              search: changeParams(
                [
                  {
                    key: "s",
                    value: e.target.value,
                    ACTION: e.target.value ? "set" : "delete",
                  },
                ],
                search
              ),
            });
          }
        }}
        onSearch={(e) =>
          history.push({
            pathname: "/",
            search: changeParams(
              [
                {
                  key: "s",
                  value: searchbar,
                  ACTION: searchbar ? "set" : "delete",
                },
              ],
              search
            ),
          })
        }
        enterKeyHint
        enterButton
        className="KeywordSearchBar"
      />
    </>
  );
}
