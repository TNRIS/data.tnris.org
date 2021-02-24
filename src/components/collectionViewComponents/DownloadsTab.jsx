import { Input, Select, Table } from "antd";
import { useState } from "react";
import { shingledJaccard } from "../../utilities/searchFunctions";

export function DownloadsTab({ resources, resourcesState }) {
  function sortFn(a, b) {
    return a.area_type_id === b.area_type_id
      ? a.resource_type_name > b.resource_type_name
        ? -1
        : 1
      : a.area_type_id > b.area_type_id
      ? 1
      : -1;
  }
  const opts = ["counties", "quads", "qquads"];
  const [pg, setPg] = useState(1);
  const [areaTypeSelection, setAreaTypeSelection] = useState("qquads");
  const [searchInput, setSearchInput] = useState(null);
  const [searchResults, setSearchResults] = useState(
    [...resources[areaTypeSelection].results].sort((a, b) => sortFn(a, b))
  );
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
              {opts.map((v, i) => (
                <Select.Option
                  key={v + "+" + i}
                  value={v}
                  disabled={resources[v].results.length === 0}
                >
                  <h3>
                    {v} ({resources[v].results.length})
                  </h3>
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
