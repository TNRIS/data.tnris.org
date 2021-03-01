import { Input } from "antd";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import useQueryParam from "../../utilities/custom-hooks/useQueryParam";
import { changeParams } from "../../utilities/changeParamsUtil";

export function KeywordSearchBar() {
  const history = useHistory();
  const search = useLocation().search;
  const param = useQueryParam().get("s")
  const [searchbar, setSearchbar] = useState(param);
  return (
    <>
      <Input.Search
        style={{ width: "50%", minWidth: "300px" }}
        placeholder="Search collections by keyword"
        value={searchbar}
        onChange={(e) => {
          console.log(e.target.value);
          setSearchbar(e.target.value);
        }}
        onSearch={(e) => history.push({
          pathname: "/",
          search: changeParams([{
            key: "s",
            value: searchbar,
            ACTION: searchbar ? "set" : "delete"
          }], search)
        })}
      />
    </>
  );
}
