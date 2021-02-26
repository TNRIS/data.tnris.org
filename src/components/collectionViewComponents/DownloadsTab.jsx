import { Input, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { hoverResourceAreaId, mapAtom } from "../../utilities/atoms/mapAtoms";
import { shingledJaccard } from "../../utilities/searchFunctions";

export function DownloadsTab({ resources, resourcesState }) {
  const map = useRecoilValue(mapAtom);
  function sortFn(a, b) {
    return a.area_type_id === b.area_type_id
      ? a.resource_type_name > b.resource_type_name
        ? -1
        : 1
      : a.area_type_id > b.area_type_id
      ? 1
      : -1;
  }
  const [opts, setOpts] = useState(
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
  const setHoverResourceId = useSetRecoilState(hoverResourceAreaId);
  // get unique "resource_type_name"s
  /* const getFileTypes = (dataset) => [
    ...new Set([...dataset].map((r) => r.resource_type_name)),
  ]; */
  const handleSearch = () => {
    if (searchInput?.length && searchInput?.length >= 3) {
      setSearchResults((searchResults) =>
        [...resources[areaTypeSelection].results]
          .map((v) => {
            return {
              ...v,
              jaccard: shingledJaccard(
                v.resource_type_name.toUpperCase(),
                searchInput.toUpperCase(),
                2 //use shingle / k-size of 2 since search corpora is small (return more results)
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
    setPg(1);
    setSearchInput(null);
    setSearchResults((searchResults) =>
      [...resources[areaTypeSelection].results].sort((a, b) => sortFn(a, b))
    );
  }, [areaTypeSelection, resources, opts]);
  return (
    <div id="DownloadsTabContentContainer">
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
              onChange={(e) => setAreaTypeSelection((areaTypeSelection) => e)}
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
        ></Input.Search>
      </div>
      <Table
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
              highlightDownloadArea(record.area_type_id, map),
            onMouseLeave: (e) =>
              removeHighlightedDownloadArea(record.area_type_id, map),
          };
        }}
        dataSource={searchResults}
        columns={[
          { title: "AreaId", dataIndex: "area_type_id" },
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
          {
            title: "Similarity",
            dataIndex: "jaccard",
          },
        ]}
      />
    </div>
  );
}

export const highlightDownloadArea = (areaTypeId, map) => {
  if (map) {
    const addFn = () => {
      map.addLayer({
        id: "dl-hover",
        type: "fill",
        source: "area-type-source",
        "source-layer": "area_type",
        minzoom: 2,
        maxzoom: 24,
        paint: {
          "fill-color": "black",
          "fill-opacity": 0.4,
        },
        filter: ["all", ["==", "area_type_id", areaTypeId]],
      });
    };
    if (areaTypeId) {
      addFn();
    }
  }
};

export const removeHighlightedDownloadArea = (areaTypeId, map) => {
  if (map && map.getLayer("dl-hover")) {
    map.removeLayer("dl-hover");
  }
};
