import { Select } from "antd";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import {
  fetchGeofilterSearchResults,
  geoFilterSearchText,
  geoFilterSelectedResult,
} from "../../utilities/atoms/geofilterAtoms";

export function GeoFilterSearchBar(props) {
  const { state, contents } = useRecoilValueLoadable(
    fetchGeofilterSearchResults
  );
  const [geoSearchInputText, setGeoSearchInputText] = useRecoilState(
    geoFilterSearchText
  );
  const [geoFilterSelection, setGeoFilterSelection] = useRecoilState(
    geoFilterSelectedResult
  );

  return (
    <Select
      showSearch
      placeholder="Search location"
      searchValue={geoSearchInputText}
      // set geoFilterSearchText atom
      // when geoFilterSearchText changes, the fetch geoFilterResults selector automatically re-runs the query to nominatim
      onSearch={(v) => setGeoSearchInputText(v)}
      showArrow={false}
      filterOption={false}
      allowClear
      onClear={() => setGeoFilterSelection(null)}
      // value is set to selection from dropdown if selection made, else, null
      value={
        geoFilterSelection ? geoFilterSelection.properties.display_name : null
      }
      // on selection change, geoFilterSelectedResult atom set to whole object from nominatim results
      onChange={(v) => setGeoFilterSelection(contents.features[v])}
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
