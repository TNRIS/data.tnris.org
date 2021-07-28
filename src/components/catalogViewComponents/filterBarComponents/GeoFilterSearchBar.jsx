import { Checkbox, Empty, Select, Spin } from "antd";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import bbox from "@turf/bbox";
import {
  fetchGeocoderSearchResults,
  geoFilterSearchText,
  geoSearchBboxAtom,
} from "../../../utilities/atoms/geofilterAtoms";
import { drawControlsAtom, mapAtom } from "../../../utilities/atoms/mapAtoms";
import { changeParams } from "../../../utilities/changeParamsUtil";
import useQueryParam from "../../../utilities/custom-hooks/useQueryParam";

export function GeoFilterSearchBar(props) {
  const history = useHistory();
  const geo = useQueryParam().get("geo");
  const search = useLocation().search;
  const map = useRecoilValue(mapAtom);

  const [drawMode, setDrawMode] = useState(false);
  const drawControls = useRecoilValue(drawControlsAtom);
  const { state, contents } = useRecoilValueLoadable(
    fetchGeocoderSearchResults
  );
  const [geoSearchInputText, setGeoSearchInputText] =
    useRecoilState(geoFilterSearchText);
  const [geoSearchBbox, setGeoSearchBbox] = useRecoilState(geoSearchBboxAtom);

  //if the geo param is set on page load, register it as the search text
  //then, store the first result as the geoFilterSelection, which will trigger map render of feature
  if (geo) {
    setGeoSearchBbox(geo);
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
    setGeoSearchBbox(null);
    if (drawControls && map) {
      drawControls.deleteAll();
    }
  };

  useEffect(() => {
    // if geo param is null, setGeoSearchBbox to null and setGetoSearchInputText null
    // this clears the input and item from the map
    if (!geo) {
      setGeoSearchBbox(null);
      setGeoSearchInputText(null);
    }
  }, [geo, setGeoSearchBbox, setGeoSearchInputText]);

  useEffect(() => {
    if (geoSearchBbox && map) {
      // Zoom to bounds of selection
      map.fitBounds(geoSearchBbox.split(","));
    }
  }, [geoSearchBbox, map]);

  // when drawMode toggled on or off, change drawMode on drawControlsAtom
  // add / remove event handler for create listener
  useEffect(() => {
    if (map && drawControls) {
      drawControls.deleteAll();
      if (drawMode) {
        drawControls.changeMode("draw_rectangle");
      } else {
        drawControls.changeMode("simple_select");
      }
    }
  }, [drawMode, map, drawControls]);

  // add draw controls create listener when draw controls and map available
  useEffect(() => {
    if (drawControls && map) {
      const drawLayerFn = (layer) => {
        console.log(layer);
        history.push({
          search: changeParams(
            [
              {
                key: "geo",
                value: bbox(layer.features[0].geometry),
                ACTION: "set",
              },
            ],
            search
          ),
        });
      };
      // Add drawLayerFn to listeners
      map.on("draw.create", drawLayerFn);
      map.on("draw.update", drawLayerFn);

      // Remove listeners on cleanup
      return () => {
        map.off("draw.create", drawLayerFn);
        map.off("draw.update", drawLayerFn);
      };
    }
  }, [drawControls, map, history, search]);

  // cleanup effect that clears the drawn layers when the component is destroyed
  useEffect(() => {
    return () => {
      if (drawControls && map) {
        drawControls.deleteAll();
        setGeoSearchBbox(null);
      }
    };
  }, [map, drawControls, setGeoSearchBbox]);

  return (
    <>
      {true && (
        <Select
          showSearch
          placeholder="Search collections by location"
          searchValue={geoSearchInputText}
          // set geoFilterSearchText atom
          // when geoFilterSearchText changes, the fetch geoFilterResults selector automatically re-runs the query to nominatim
          onSearch={(v) => {
            setGeoSearchInputText(v);
          }}
          notFoundContent={
            state === "loading" ? <Spin size="small" /> : <Empty />
          }
          showArrow={false}
          filterOption={false}
          allowClear
          loading={state === "loading"}
          onClear={handleClear}
          // value is set to selection from dropdown if selection made, else, null
          value={geoSearchBbox ? geoSearchBbox : null}
          // on selection change, set URI
          // and set geoSearchInputTextAtom and geoSearchBboxAtom
          onChange={(v) => {
            if (contents.features[v]?.properties) {
              //console.log(v, contents.features[v]);
              history.push({
                search: changeParams(
                  [
                    {
                      key: "geo",
                      value: contents?.features[v]?.bbox,
                      ACTION: "set",
                    },
                  ],
                  search
                ),
              });
              setGeoSearchBbox(contents.features[v].bbox);
              setGeoSearchInputText(
                contents.features[v].properties.display_name
              );
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
      )}
      <Checkbox
        checked={drawMode}
        onChange={() => setDrawMode((currentMode) => !currentMode)}
      >
        Draw search boundary
      </Checkbox>
    </>
  );
}
