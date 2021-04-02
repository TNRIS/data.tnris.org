import { Input, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { mapAtom } from "../../utilities/atoms/mapAtoms";
import {
  highlightAreaType,
  removeHighlightAreaType,
  highlightDownloadArea,
  removeHighlightedDownloadArea,
} from "../../utilities/mapHelpers/highlightHelpers";
import { shingledJaccard } from "../../utilities/searchFunctions";

export function DownloadsTab({
  activeTab,
  areaTypes, 
  areaTypesState,
  resources,
  resourcesState
}) {
  const map = useRecoilValue(mapAtom);
  function sortFn(a, b) {
    return a.area_type_name === b.area_type_name
      ? a.resource_type_name > b.resource_type_name
        ? -1
        : 1
      : a.area_type_name > b.area_type_name
      ? 1
      : -1;
  }
  const [opts] = useState(
    Object.keys(resources).sort((a, b) =>
      resources[a].results.length > resources[b].results.length ? -1 : 1
    )
  );
  const [pg, setPg] = useState(1);
  const [areaTypeSelection, setAreaTypeSelection] = useState(opts[0]);
  const [searchInput, setSearchInput] = useState(null);
  const [searchResults, setSearchResults] = useState(
    [...resources[areaTypeSelection].results].sort((a, b) => sortFn(a, b))
  );

  const handleSearch = () => {
    if (searchInput?.length && searchInput?.length >= 3) {
      setSearchResults((searchResults) =>
        [...resources[areaTypeSelection].results]
          .map((v) => {
            return {
              ...v,
              jaccard: shingledJaccard(
                v.area_type_name.toUpperCase(),
                searchInput.toUpperCase(),
                2 //use shingle (k-size) of 2 since search corpora is small (return more results)
              ),
            };
          })
          .sort((a, b) => (a.jaccard > b.jaccard ? -1 : 1))
      );
      setPg(1);
    } else {
      setSearchResults((searchResults) =>
        [...resources[areaTypeSelection].results].sort((a, b) => sortFn(a, b))
      );
      setPg(1);
    }
  };

  useEffect(() => {
    console.log(`tab selected: ${activeTab}`)
    console.log(opts);
    console.log(areaTypesState, areaTypes);
    
    // Add map sources and layers for each
    // area type geojson that has features 
    for (let [k, v] of Object.entries(areaTypes)) {
      if (v["features"].length) {
        console.log(k)
        if (!map.getSource("quad-source")) {
          map.addSource(`${k}-source`, {
            type: "geojson",
            data: v,
            promoteId: "area_type_id"
          });

          map.addLayer(
            {
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
              layout: { visibility: "none" }
            }
          );

          map.addLayer(
            {
              id: `${k}-hover`,
              type: "fill",
              source: `${k}-source`,
              minzoom: 2,
              maxzoom: 24,
              paint: {
                // hover state is set here using a case expression
                'fill-color': [
                  'case',
                  ['boolean', ['feature-state', 'hover'], false],
                  "#ff00fa",
                  "#999"
                ],
                'fill-opacity': .8
              },
              layout: { visibility: "none" }
            }, `${k}-outline`
          );
        }
      }
    }

    // let hoveredStateId = null;
    // // When the user moves their mouse over the hover layer, we'll
    // // update the feature state for the feature under the mouse.
    // map.on("mousemove", `${areaTypeSelection}-hover`, function(e) {
    //   map.getCanvas().style.cursor = 'pointer';
    //   if (e.features.length > 0) {
    //     if (hoveredStateId !== null) {
    //       removeHighlightAreaType(areaTypeSelection, hoveredStateId, map)
    //     }
    //     hoveredStateId = e.features[0].id
    //     highlightAreaType(areaTypeSelection, hoveredStateId, map)
    //   }
    // });

    // // When the mouse leaves the hover layer, update the feature
    // // state of the previously hovered feature.
    // map.on('mouseleave', `${areaTypeSelection}-hover`, function () {
    //   map.getCanvas().style.cursor = '';
    //   if (hoveredStateId !== null) {
    //     removeHighlightAreaType(areaTypeSelection, hoveredStateId, map)
    //   }
    //   hoveredStateId = null;
    // });

    return () =>
      opts.forEach((v) => {
        // map.setLayoutProperty(`${v}-outline`, "visibility", "none");
        if (map.getLayer(`${v}-outline`)) {
          map.removeLayer(`${v}-outline`);
        }
        if (map.getLayer(`${v}-hover`)) {
          map.removeLayer(`${v}-hover`);
        }
        if (map.getSource(`${v}-source`)) {
          map.removeSource(`${v}-source`);
        }
      });
  }, []);

  // when the activeTab changes toggle the area type layer on and off
  useEffect(() => {
    console.log(map.getStyle())
    if (activeTab !== "1") {
      if (map.getLayer(`${areaTypeSelection}-outline`)) {
        map.setLayoutProperty(`${areaTypeSelection}-outline`, "visibility", "none");
        map.setLayoutProperty(`${areaTypeSelection}-hover`, "visibility", "none");
      }
    } else {
      if (map.getLayer(`${areaTypeSelection}-outline`)) {
        map.setLayoutProperty(`${areaTypeSelection}-outline`, "visibility", "visible");
        map.setLayoutProperty(`${areaTypeSelection}-hover`, "visibility", "visible");
      }
    }
  })
  
  // when areaTypeSelection changes
  useEffect(() => {
    //set pagination to pg 1
    setPg(1);
    //clear Downloads SearchBar
    setSearchInput(null);
    //set results equal to resources sorted by area name
    setSearchResults((searchResults) =>
      [...resources[areaTypeSelection].results].sort((a, b) => sortFn(a, b))
    );

    //for each of counties, quads, qquads, check if it is the current selection
    //if not current selection, set visibility to none, else set to visible and
    //filter
    opts.forEach((v) => {
      if (v !== areaTypeSelection) {
        console.log(v)
        if (map.getLayer(`${v}-outline`)) {
          map.setLayoutProperty(`${v}-outline`, "visibility", "none");
          map.setLayoutProperty(`${v}-hover`, "visibility", "none");
        }
      } else {
        console.log(`${v} was chosen`)
        if (map.getLayer(`${v}-outline`)) {
          map.setLayoutProperty(`${v}-outline`, "visibility", "visible");
          map.setLayoutProperty(`${v}-hover`, "visibility", "visible");
        }
        // const rsrcAreas = [...resources[areaTypeSelection].results].map(
        //   (v) => v.area_type_id
        // );
        // map.setFilter(`${v}-outline`, ["in", "area_type_id", ...rsrcAreas]);
      }
    });

    let hoveredStateId = null;
    // When the user moves their mouse over the hover layer, we'll
    // update the feature state for the feature under the mouse.
    map.on("mousemove", `${areaTypeSelection}-hover`, function(e) {
      map.getCanvas().style.cursor = 'pointer';
      if (e.features.length > 0) {
        if (hoveredStateId !== null) {
          removeHighlightAreaType(areaTypeSelection, hoveredStateId, map)
        }
        hoveredStateId = e.features[0].id
        highlightAreaType(areaTypeSelection, hoveredStateId, map)
      }
    });

    // When the mouse leaves the hover layer, update the feature
    // state of the previously hovered feature.
    map.on('mouseleave', `${areaTypeSelection}-hover`, function () {
      map.getCanvas().style.cursor = '';
      if (hoveredStateId !== null) {
        removeHighlightAreaType(areaTypeSelection, hoveredStateId, map)
      }
      hoveredStateId = null;
    });

    // return () =>
    //   opts.forEach((v) => {
    //     // map.setLayoutProperty(`${v}-outline`, "visibility", "none");
    //     if (map.getLayer(`${v}-outline`)) {
    //       map.removeLayer(`${v}-outline`);
    //     }
    //     if (map.getLayer(`${v}-hover`)) {
    //       map.removeLayer(`${v}-hover`);
    //     }
    //     if (map.getSource(`${v}-source`)) {
    //       map.removeSource(`${v}-source`);
    //     }
    //   });
  }, [areaTypeSelection, resources, opts, map]);

  return (
    <div id="DownloadsTabContentContainer">
      <Table
        title={() => (
          <div className="search">
            <Input.Search
              enterButton={true}
              placeholder={`Search by ${areaTypeSelection} by name`}
              value={searchInput}
              onChange={(e) => setSearchInput((searchInput) => e.target.value)}
              onSearch={handleSearch}
              allowClear
              addonBefore={
                <Select
                  value={areaTypeSelection}
                  onChange={(e) =>
                    setAreaTypeSelection((areaTypeSelection) => e)
                  }
                >
                  {opts
                    .sort((a, b) =>
                      resources[a].results.length > resources[b].results.length
                        ? -1
                        : 1
                    )
                    .map((v, i) => (
                      <Select.Option
                        key={v + "+" + i}
                        value={v}
                        disabled={resources[v].results.length === 0}
                      >
                        {v} ({resources[v].results.length})
                      </Select.Option>
                    ))}
                </Select>
              }
            />
          </div>
        )}
        id="DownloadsTable"
        loading={resourcesState === "loading"}
        sticky
        pagination={{
          position: ["topCenter", "bottomCenter"],
          size: "small",
          current: pg,
          onChange: (pg, pgSz) => setPg(pg),
        }}
        rowKey={"resource"}
        onRow={(record, index) => {
          return {
            onMouseEnter: (e) =>
              // highlightDownloadArea(record.area_type_id, map),
              highlightAreaType(areaTypeSelection, record.area_type_id, map),
            onMouseLeave: (e) =>
              // removeHighlightedDownloadArea(record.area_type_id, map),
              removeHighlightAreaType(areaTypeSelection, record.area_type_id, map),
          };
        }}
        dataSource={searchResults}
        columns={[
          {
            title: "Name",
            dataIndex: "area_type_name",
            render: (name) => `${name}`,
          },
          {
            title: "Type",
            dataIndex: "resource_type_name",
          },
          {
            title: "File Size",
            dataIndex: "filesize",
            render: (sz, i) => (
              <span key={sz + "_" + i}>{Math.floor(sz / 100000)} mb</span>
            ),
          },
          {
            title: "Download",
            dataIndex: "resource",
            render: (link) => (
              <a key={link} href={link}>
                Download
              </a>
            ),
          },
          /* {
            title: "Similarity",
            dataIndex: "jaccard",
          }, */
        ]}
      />
    </div>
  );
}
