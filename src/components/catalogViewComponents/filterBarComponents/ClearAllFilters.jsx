import { Button } from "antd";
import { useHistory, useLocation } from "react-router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { geoSearchSelectionAtom } from "../../../atoms/geofilterAtoms";
import { drawControlsAtom } from "../../../atoms/mapAtoms";
import { changeParams } from "../../../utilities/changeParamsUtil";

export function ClearAllFilters(props) {
  const history = useHistory();
  const { search } = useLocation();
  const setGeoFilterSelection = useSetRecoilState(geoSearchSelectionAtom);
  const drawControls = useRecoilValue(drawControlsAtom);
  const clearFiltersKeys = [
    "availability",
    "category",
    "file_type",
    "dates",
    "sort",
    "geo",
    "pg",
    "s",
  ];

  return (
    <>
      {clearFiltersKeys.filter((v) => search.includes(v)).length > 1 && (
        <Button
          {...props}
          type="link"
          onClick={() => {
            history.push({
              search: changeParams(
                clearFiltersKeys.map((k) => {
                  return { key: k, value: null, ACTION: "delete" };
                }),
                search
              ),
            });
            if (drawControls) {
              drawControls.deleteAll();
            }
            setGeoFilterSelection((v) => {
              if (v) {
                return null;
              } else {
                return v;
              }
            });
          }}
        >
          Clear all filters &#10005;
        </Button>
      )}
      {clearFiltersKeys.filter((v) => search.includes(v)).length < 2 && null}
    </>
  );
}
