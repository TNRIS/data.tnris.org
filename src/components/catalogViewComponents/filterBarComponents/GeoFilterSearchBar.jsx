import { Empty, Select, Spin } from "antd";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import {
  fetchGeofilterSearchResults,
  geoFilterSearchText,
  geoFilterSelectedResult,
} from "../../../utilities/atoms/geofilterAtoms";
import { mapAtom } from "../../../utilities/atoms/mapAtoms";
import { changeParams } from "../../../utilities/changeParamsUtil";
import useQueryParam from "../../../utilities/custom-hooks/useQueryParam";

export function GeoFilterSearchBar(props) {
  const history = useHistory();
  const geo = useQueryParam().get("geo");
  const search = useLocation().search;
  const map = useRecoilValue(mapAtom);

  const { state, contents } = useRecoilValueLoadable(
    fetchGeofilterSearchResults
  );
  const [geoSearchInputText, setGeoSearchInputText] = useRecoilState(
    geoFilterSearchText
  );
  const [geoFilterSelection, setGeoFilterSelection] = useRecoilState(
    geoFilterSelectedResult
  );

  //if the geo param is set on page load, register it as the search text
  //then, store the first result as the geoFilterSelection, which will trigger map render of feature
  if (geo) {
    setGeoSearchInputText(geo);
    if (state !== "loading" && contents.features.length) {
      setGeoFilterSelection(contents.features[0]);
    }
  }
  const handleClear = () => {
    history.push({
      pathname: "/",
      search: changeParams(
        [
          {
            key: "geo",
            value: null,
            ACTION: "delete",
          },
        ],
        search
      ),
    });
    setGeoFilterSelection(null);
  };

  useEffect(() => {
    // if geo param is null, setGeoFilterSelection to null and setGetoSearchInputText null
    // this clears the input and item from the map
    if (!geo) {
      setGeoFilterSelection(null);
      setGeoSearchInputText(null);
    }
  }, [geo, setGeoFilterSelection, setGeoSearchInputText]);

  useEffect(() => {
    if(geoFilterSelection){
      // Zoom to bounds of selection
      map.fitBounds(geoFilterSelection.bbox);
    }
  }, [geoFilterSelection, map])
  return (
    <Select
      showSearch
      placeholder="Search collections by location"
      searchValue={geoSearchInputText}
      // set geoFilterSearchText atom
      // when geoFilterSearchText changes, the fetch geoFilterResults selector automatically re-runs the query to nominatim
      onSearch={(v) => {
        setGeoSearchInputText(v);
      }}
      notFoundContent={state === "loading" ? <Spin size="small" /> : <Empty />}
      showArrow={false}
      filterOption={false}
      allowClear
      loading={state === "loading"}
      onClear={handleClear}
      // value is set to selection from dropdown if selection made, else, null
      value={
        geoFilterSelection ? geoFilterSelection.properties.display_name : null
      }
      // on selection change, geoFilterSelectedResult atom set to whole object from nominatim results
      onChange={(v) => {
        if (contents.features[v]?.properties) {
          //console.log(v, contents.features[v]);
          history.push({
            search: changeParams(
              [
                {
                  key: "geo",
                  value: contents?.features[v]?.properties?.display_name,
                  ACTION: "set",
                },
              ],
              search
            ),
          });
          setGeoFilterSelection(contents.features[v]);
        }
      }}
      className="GeoFilterSearchBar"
      {...props}
    >
      {
        // if nominatim has returned results with length > 0, return as options
      }
      {state !== "loading" &&
        contents &&
        contents.features.length > 0 &&
        contents.features.map((v, i) => (
          <Select.Option key={i} value={i}>
            {v.properties.display_name}
          </Select.Option>
        ))}
    </Select>
  );
}
