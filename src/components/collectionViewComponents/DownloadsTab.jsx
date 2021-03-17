import { Input, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { mapAtom } from "../../utilities/atoms/mapAtoms";
import {
  highlightDownloadArea,
  removeHighlightedDownloadArea,
} from "../../utilities/mapHelpers/highlightHelpers";
import { shingledJaccard } from "../../utilities/searchFunctions";

export function DownloadsTab({ resources, resourcesState }) {
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
    //if not current selection, set visibility to none, else set to visible and filter
    opts.forEach((v) => {
      if (v !== areaTypeSelection) {
        map.setLayoutProperty(`${v}-outline`, "visibility", "none");
      } else {
        map.setLayoutProperty(`${v}-outline`, "visibility", "visible");
        const rsrcAreas = [...resources[areaTypeSelection].results].map(
          (v) => v.area_type_id
        );
        map.setFilter(`${v}-outline`, ["in", "area_type_id", ...rsrcAreas]);
      }
    });

    return () =>
      opts.forEach((v) => {
        map.setLayoutProperty(`${v}-outline`, "visibility", "none");
      });
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
          pageSizeOptions: [12,24,60,120],
          defaultPageSize: 12,
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
