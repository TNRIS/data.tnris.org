import { Empty, Select } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { useEffect } from "react/cjs/react.development";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import {
  fetchGeocoderSearchResultsSelector,
  geoFilterSearchTextAtom,
  geoSearchSelectionAtom,
} from "../../../atoms/geofilterAtoms";
import { mapAtom } from "../../../atoms/mapAtoms";
import { changeParams } from "../../../utilities/changeParamsUtil";
import useQueryParam from "../../../utilities/customHooks/useQueryParam";

export function GeoFilterSearchBarV2({
  handleOnSetSelectedSearchOption = (selectedValue) =>
    console.log("SELECTED VALUE: ", selectedValue),
  handleOnClearSelectedSearchOption = (clearedValue) =>
    console.log("CLEARED VALUE: ", clearedValue),
  notFoundContent = <Empty />,
  placeholder = "input search text",
}) {
  //////////////////////////////
  ////custom hooks//////////////
  //////////////////////////////
  const geo = useQueryParam().get("geo");
  //////////////////////////////
  ////3rd party hooks///////////
  //////////////////////////////
  const history = useHistory();
  const search = useLocation().search;
  //////////////////////////////
  ////recoil state//////////////
  //////////////////////////////
  //const MAP = useRecoilValue(mapAtom);
  //input text of search box.
  //triggers fetch of options from nominatim
  const [SEARCH_INPUT, SET_SEARCH_INPUT] = useRecoilState(
    geoFilterSearchTextAtom
  );
  //results of nominatim search.
  //triggered by change of SEARCH_INPUT (geoFilterSearchTextAtom)
  const { state: SEARCH_STATE, contents: SEARCH_RESULTS } =
    useRecoilValueLoadable(fetchGeocoderSearchResultsSelector);
  //stores selected search result.
  const [SEARCH_SELECTION, SET_SEARCH_SELECTION] = useRecoilState(
    geoSearchSelectionAtom
  );

  //////////////////////////////
  ////handler functions/////////
  //////////////////////////////
  const HANDLE_ON_SEARCH = (input) => {
    SET_SEARCH_INPUT(input);
  };
  const HANDLE_ON_SEARCH_SELECTION_CHANGE = (result_index) => {
    //get result at selected index value
    const RESULT_AT_INDEX = SEARCH_RESULTS["features"][result_index];
    //set geo search param equal to bbox of selected value
    if (RESULT_AT_INDEX) {
      history.push({
        search: changeParams(
          [
            {
              key: "geo",
              value: RESULT_AT_INDEX.bbox,
              ACTION: "set",
            },
          ],
          search
        ),
      });
      SET_SEARCH_SELECTION(RESULT_AT_INDEX);
      //Execute optional function passed as property when seletion changes.
      //Default function does nothing and returns null.
      handleOnSetSelectedSearchOption(RESULT_AT_INDEX);
    }
  };
  const HANDLE_NAV_WITH_GEO_PARAM = (v) => {
    if (v) {
      history.push({
        search: changeParams(
          [
            {
              key: "geo",
              value: v.bbox,
              ACTION: "set",
            },
          ],
          search
        ),
      });
      SET_SEARCH_SELECTION({
        bbox: v.bbox,
        properties: { display_name: "Custom search boundary" },
      });
    }
  };
  //Function to handle clear controls of antd Select component
  const HANDLE_ON_CLEAR_FN = () => {
    history.push({
      pathname: window.location.pathname,
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
    SET_SEARCH_INPUT(null);
    SET_SEARCH_SELECTION(null);
    //Execute optional function passed as proeprty when selection cleared
    //Default function does nothing and returns null.
    handleOnClearSelectedSearchOption(SEARCH_SELECTION);
  };

  useEffect(() => {
    SET_SEARCH_SELECTION(cur => {
      
    })
  }, [SET_SEARCH_SELECTION, HANDLE_NAV_WITH_GEO_PARAM, geo,]);

  return (
    <Select
      placeholder={placeholder}
      loading={() => SEARCH_STATE === "loading"}
      searchValue={SEARCH_INPUT}
      onSearch={HANDLE_ON_SEARCH}
      options={
        SEARCH_RESULTS &&
        SEARCH_RESULTS.features &&
        SEARCH_RESULTS.features.length &&
        SEARCH_STATE === "hasValue"
          ? SEARCH_RESULTS.features.map((feature, index) => {
              return {
                key: feature.properties.display_name + "_" + index,
                label: feature.properties.display_name,
                value: index,
              };
            })
          : null
      }
      notFoundContent={notFoundContent}
      onClear={HANDLE_ON_CLEAR_FN}
      value={
        SEARCH_SELECTION ? SEARCH_SELECTION["properties"]["display_name"] : null
      }
      onChange={HANDLE_ON_SEARCH_SELECTION_CHANGE}
      className="GeoFilterSearchBar"
      getPopupContainer={(triggerNode) => triggerNode.parentNode}
      showSearch
      allowClear
      showArrow={false}
      filterOption={false}
    />
  );
}
