import { Alert, Empty, List, Select } from "antd";
import { Popup } from "maplibre-gl";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { collectionAreasMapSelectionAtom } from "../../utilities/atoms/collectionsAtoms";
import { mapAtom } from "../../utilities/atoms/mapAtoms";
import {
  highlightSelectedAreaType,
  removeCoverageLayer,
  unHighlightSelectedAreaType,
} from "../../utilities/mapHelpers/highlightHelpers";
import {
  hideLayer,
  showLayer,
} from "../../utilities/mapHelpers/layerVisibilityHelpers";
import { zoomToFeatures } from "../../utilities/mapHelpers/zoomHelpers";
import { DownloadAreaResources } from "./DownloadAreaResources";
import { activeTabAtom } from "./TabsContainer";

export function DownloadAreasList({ areaTypes, areaTypesState, collectionId }) {
  const map = useRecoilValue(mapAtom);
  const setActiveTab = useSetRecoilState(activeTabAtom);
  const [opts] = useState(
    Object.keys(areaTypes)
      .map((v) => {
        return { type: v, count: areaTypes[v].features.length };
      })
      .sort((a, b) => (a.count > b.count ? -1 : 1))
  );
  const [areaTypeSelection, setAreaTypeSelection] = useState(opts[0].type);
  const [selectedAreas, setSelectedAreas] = useRecoilState(
    collectionAreasMapSelectionAtom
  );
  const [areaHover, setAreaHover] = useState();

  // Add the area type layers when the component mounts
  useEffect(() => {
    if (map) {
      // Add map sources and layers for each
      // area type geojson that has features
      //console.log(areaTypes);
      for (let [k, v] of Object.entries(areaTypes)) {
        if (v["features"].length && map) {
          if (!map.getSource(`${k}-source`)) {
            map.addSource(`${k}-source`, {
              type: "geojson",
              data: v,
              promoteId: "area_type_id",
            });
            // Add base outline layer for areas
            map.addLayer({
              id: `${k}-outline`,
              type: "line",
              source: `${k}-source`,
              minzoom: 2,
              maxzoom: 24,
              paint: {
                "line-color": "#fff",
                "line-width": 2.0,
                "line-opacity": 0.75,
              },
              layout: { visibility: "none" },
            });
            // Add hover layer for hover highlight
            // Controlled by feature state
            map.addLayer(
              {
                id: `${k}-hover`,
                type: "fill",
                source: `${k}-source`,
                minzoom: 2,
                maxzoom: 24,
                paint: {
                  // hover state is set here using a case expression
                  "fill-color": [
                    "case",
                    ["boolean", ["feature-state", "hover"], false],
                    "#73808c",
                    "#73808c",
                  ],
                  "fill-outline-color": "#fff",
                  "fill-opacity": [
                    "case",
                    ["boolean", ["feature-state", "hover"], false],
                    0.5,
                    0.25,
                  ],
                },
                layout: {
                  visibility: "none",
                },
              },
              `${k}-outline`
            );
            // Add layer for selectedAreas highlight
            map.addLayer(
              {
                id: `${k}-select`,
                type: "fill",
                source: `${k}-source`,
                minzoom: 2,
                maxzoom: 24,
                paint: {
                  // hover state is set here using a case expression
                  "fill-color": "#73808c",
                  "fill-opacity": 0.75,
                },
                filter: ["match", ["get", "area_type_id"], "", true, false],
              },
              `${k}-hover`
            );
            // Add listener to add area to selectedAreas atom on click
          }
        }
      }
      // Clean up the area type layers when
      // returning to the catalog view
      return () => {
        setSelectedAreas([]);
        opts.forEach((v) => {
          if (map.getLayer(`${v.type}-outline`)) {
            map.removeLayer(`${v.type}-outline`);
          }
          if (map.getLayer(`${v.type}-hover`)) {
            map.removeLayer(`${v.type}-hover`);
          }
          if (map.getLayer(`${v.type}-select`)) {
            map.removeLayer(`${v.type}-select`);
          }
          if (map.getSource(`${v.type}-source`)) {
            map.removeSource(`${v.type}-source`);
          }
        });
      };
    }
  }, [areaTypes, map, opts, setSelectedAreas]);

  // Add click listener to active area layers in map
  useEffect(() => {
    function handleHoverClick(e) {
      setSelectedAreas((current) => {
        //console.log(current);
        if (current.includes(e.features[0].properties.area_type_id)) {
          return current.filter(
            (f) => f !== e.features[0].properties.area_type_id
          );
        } else {
          return [...current, e.features[0].properties.area_type_id];
        }
      });
      setActiveTab((currentTab) => {
        //console.log(currentTab);
        if (currentTab !== "1") {
          return "1";
        }
        return currentTab;
      });
    }

    if (map && areaTypes && areaTypesState === "hasValue") {
      for (let k of Object.keys(areaTypes)) {
        map.on("click", `${k}-hover`, handleHoverClick);
      }
    }

    return () => {
      if (map && areaTypes) {
        for (let k of Object.keys(areaTypes)) {
          map.off("click", `${k}-hover`, handleHoverClick);
          map.off("hover", `${k}-hover`);
        }
      }
    };
  }, [setActiveTab, map, setSelectedAreas, areaTypes, areaTypesState]);

  // show areas in map based on selected areaType in areaTypeSelection
  useEffect(() => {
    showLayer(`${areaTypeSelection}-outline`, map);
    showLayer(`${areaTypeSelection}-hover`, map);
    showLayer(`${areaTypeSelection}-select`, map);
    removeCoverageLayer(map);
  }, [areaTypeSelection, map]);

  useEffect(() => {
    if (map) {
      function mouseEnter(e) {
        setAreaHover(e.features[0].properties.area_type_id);

        map.getCanvas().style.cursor = "pointer";
        // add tooltip with area name
        let name = e.features[0].properties.area_type_name;
        popup.setLngLat(e.lngLat).setHTML(name).addTo(map);
        // toggle highlight with hover-state
        if (e.features.length > 0) {
          if (hoveredStateId !== null) {
            unHighlightSelectedAreaType(areaTypeSelection, hoveredStateId, map);
          }
          hoveredStateId = e.features[0].id;
          highlightSelectedAreaType(areaTypeSelection, hoveredStateId, map);
        }
      }
      function mouseLeave(e) {
        map.getCanvas().style.cursor = "";
        //remove popup
        popup.remove();
        setAreaHover(null);
        if (hoveredStateId !== null) {
          unHighlightSelectedAreaType(areaTypeSelection, hoveredStateId, map);
        }
        hoveredStateId = null;
      }
      // For each counties, quads, qquads, if not current selection,
      // set visibility to none, else set to visible
      opts.forEach((v) => {
        if (v.type !== areaTypeSelection) {
          hideLayer(`${v.type}-outline`, map);
          hideLayer(`${v.type}-source`, map);
          hideLayer(`${v.type}-select`, map);
        } else {
          showLayer(`${v.type}-outline`, map);
          showLayer(`${v.type}-source`, map);
          showLayer(`${v.type}-select`, map);
        }
      });
      let popup = new Popup();
      let hoveredStateId = null;
      // When the user moves their mouse over the hover layer, update
      // the feature state for the feature under the mouse.
      map.on("mousemove", `${areaTypeSelection}-hover`, mouseEnter);

      // When the mouse leaves the hover layer, update the feature
      // state of the previously hovered feature.
      map.on("mouseleave", `${areaTypeSelection}-hover`, mouseLeave);

      return () => {
        if (map) {
          popup.remove();
          opts.forEach((v) => {
            map.off(`${v}-hover`, mouseEnter);
            map.off(`${v}-hover`, mouseLeave);
          });
        }
      };
    }
  }, [areaTypeSelection, areaTypes, opts, map]);

  useEffect(() => {
    // need to hide layer when no selected areas
    // else, show layer
    if (selectedAreas.length === 0) {
      hideLayer(`${areaTypeSelection}-select`, map);
    } else {
      showLayer(`${areaTypeSelection}-select`, map);
    }
    if (selectedAreas.length > 0) {
      // set filter to layer of aretypeselection
      // filter to highlight selectedAreas
      // console.log(selectedAreas);
      map.setFilter(`${areaTypeSelection}-select`, [
        "match",
        ["get", "area_type_id"],
        selectedAreas,
        true,
        false,
      ]);
    }
  }, [map, selectedAreas, areaTypeSelection]);

  useEffect(() => {
    zoomToFeatures(map, areaTypes[areaTypeSelection], 100);
    //reset active tab to "0" on unmount
    return () => {
      setActiveTab("0");
    };
  }, [areaTypeSelection, map, areaTypes, setActiveTab]);

  return (
    <div style={{ padding: "1rem" }}>
      <Alert
        type="info"
        message={
          <span>
            Select one or more areas from the searchable list below or from the
            map to view available resources for each respective area for this
            collection.
          </span>
        }
        showIcon
      />
      <div
        style={{
          paddingTop: "1rem",
        }}
      >
        <Select
          size="large"
          value={areaTypeSelection}
          style={{ width: "25%" }}
          onChange={(v) => {
            opts.forEach((t) => {
              hideLayer(`${t.type}-outline`, map);
              hideLayer(`${t.type}-hover`, map);
              hideLayer(`${t.type}-select`, map);
            });
            setSelectedAreas([]);
            setAreaTypeSelection(v);
          }}
        >
          {opts.map((v) => (
            <Select.Option key={`select-area-type-${v.type}`} value={v.type}>
              {`${v.type} (${v.count})`}
            </Select.Option>
          ))}
        </Select>
        <Select
          size="large"
          mode="multiple"
          allowClear
          placeholder={`Search for area by ${areaTypeSelection}`}
          options={[...areaTypes[areaTypeSelection].features]
            .map((v) => {
              return {
                value: v.properties.area_type_id,
                label: v.properties.area_type_name,
              };
            })
            .sort((a, b) => (a.label > b.label ? 1 : -1))}
          value={selectedAreas}
          onSelect={(newValue) =>
            setSelectedAreas((currentlySelected) => [
              ...currentlySelected,
              newValue,
            ])
          }
          onDeselect={(toRemove) =>
            setSelectedAreas((currentlySelected) => [
              ...currentlySelected.filter((v) => v !== toRemove),
            ])
          }
          onClear={() => setSelectedAreas([])}
          filterOption={(input, option) =>
            option.label.toUpperCase().indexOf(input.toUpperCase()) >= 0
          }
          style={{ width: "75%" }}
        />
      </div>

      <div>
        {selectedAreas && selectedAreas.length > 0 && (
          <List style={{ marginTop: "1rem" }}>
            {selectedAreas.map((v) => (
              <DownloadAreaResources
                key={`resources_${v}`}
                hovered={areaHover && areaHover === v}
                collectionId={collectionId}
                areaTypeId={v}
              />
            ))}
          </List>
        )}
        {(!selectedAreas || selectedAreas.length === 0) && (
          <Empty
            style={{ paddingTop: "4rem" }}
            description="Select one or more areas from the map or from the search box above to view collection resources for each area"
          />
        )}
      </div>
    </div>
  );
}
