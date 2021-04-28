import { Alert, Empty, List, Select } from "antd";
import { Popup } from "maplibre-gl";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { collectionAreasMapSelectionAtom } from "../../utilities/atoms/collectionsAtoms";
import { mapAtom } from "../../utilities/atoms/mapAtoms";
import {
  highlightSelectedAreaType,
  unHighlightSelectedAreaType,
} from "../../utilities/mapHelpers/highlightHelpers";
import {
  hideLayer,
  showLayer,
} from "../../utilities/mapHelpers/layerVisibilityHelpers";
import { DownloadAreaResources } from "./DownloadAreaResources";

export function DownloadAreasList({
  activeTab,
  areaTypes,
  areaTypesState,
  collectionId,
}) {
  const map = useRecoilValue(mapAtom);
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

  // Add the area type layers when the component mounts
  useEffect(() => {
    // Add map sources and layers for each
    // area type geojson that has features
    //console.log(areaTypes);
    for (let [k, v] of Object.entries(areaTypes)) {
      if (v["features"].length) {
        if (!map.getSource(`${k}-source`)) {
          map.addSource(`${k}-source`, {
            type: "geojson",
            data: v,
            promoteId: "area_type_id",
          });

          map.addLayer({
            id: `${k}-outline`,
            type: "line",
            source: `${k}-source`,
            minzoom: 2,
            maxzoom: 24,
            paint: {
              "line-color": "#222",
              "line-width": 1.0,
              "line-opacity": 0.75,
            },
            layout: { visibility: "none" },
          });

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
                  "#ff00fa",
                  "#999",
                ],
                "fill-opacity": [
                  "case",
                  ["boolean", ["feature-state", "hover"], false],
                  0.3,
                  0.05,
                ],
              },
              layout: {
                visibility: "none",
              },
            },
            `${k}-outline`
          );

          map.addLayer(
            {
              id: `${k}-select`,
              type: "fill",
              source: `${k}-source`,
              minzoom: 2,
              maxzoom: 24,
              paint: {
                // hover state is set here using a case expression
                "fill-color": "#ff00fa",
                "fill-opacity": 0.5,
              },
              filter: ["match", ["get", "area_type_id"], "", true, false],
            },
            `${k}-hover`
          );

          map.on("click", `${k}-hover`, function (e) {
            console.log("area clicked");
            setSelectedAreas((current) => {
              if (current.includes(e.features[0].properties.area_type_id)) {
                return current.filter(
                  (v) => v !== e.features[0].properties.area_type_id
                );
              } else {
                return [...current, e.features[0].properties.area_type_id];
              }
            });
          });
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
        if (map.getLayer(`map-select`)) {
          map.removeLayer(`map-select`);
        }
        if (map.getSource(`${v.type}-source`)) {
          map.removeSource(`${v.type}-source`);
        }
      });
    };
  }, [areaTypes, map, opts, setSelectedAreas]);

  // When the activeTab changes toggle the
  // area type layer on and off. The downloads
  // tab key = "1".
  useEffect(() => {
    if (activeTab !== "1") {
      hideLayer(`${areaTypeSelection}-outline`, map);
      hideLayer(`${areaTypeSelection}-hover`, map);
      hideLayer(`${areaTypeSelection}-select`, map);
      showLayer("collection-coverage-layer", map);
    } else {
      showLayer(`${areaTypeSelection}-outline`, map);
      showLayer(`${areaTypeSelection}-hover`, map);
      showLayer(`${areaTypeSelection}-select`, map);
      hideLayer("collection-coverage-layer", map);
    }
  });
  useEffect(() => {
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
    map.on("mousemove", `${areaTypeSelection}-hover`, function (e) {
      map.getCanvas().style.cursor = "pointer";
      let name = e.features[0].properties.area_type_name;
      console.log(e);
      popup.setLngLat(e.lngLat).setHTML(name).addTo(map);
      if (e.features.length > 0) {
        if (hoveredStateId !== null) {
          unHighlightSelectedAreaType(areaTypeSelection, hoveredStateId, map);
        }
        hoveredStateId = e.features[0].id;
        highlightSelectedAreaType(areaTypeSelection, hoveredStateId, map);
      }
    });
    map.on("mouseenter", `${areaTypeSelection}-hover`, function(e){})
    // When the mouse leaves the hover layer, update the feature
    // state of the previously hovered feature.
    map.on("mouseleave", `${areaTypeSelection}-hover`, function () {
      map.getCanvas().style.cursor = "";
      popup.remove();
      if (hoveredStateId !== null) {
        unHighlightSelectedAreaType(areaTypeSelection, hoveredStateId, map);
      }
      hoveredStateId = null;
    });

    return () => popup.remove();
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
      console.log(selectedAreas);
      map.setFilter(`${areaTypeSelection}-select`, [
        "match",
        ["get", "area_type_id"],
        selectedAreas,
        true,
        false,
      ]);
    }
  }, [map, selectedAreas, areaTypeSelection]);

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
            <Select.Option value={v.type}>
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
          <List bordered style={{ marginTop: "1rem" }}>
            {selectedAreas.map((v) => (
              <DownloadAreaResources
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
