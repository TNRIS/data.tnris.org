import {
  Badge,
  Button,
  Checkbox,
  Col,
  Input,
  Popover,
  Row,
  Select,
  Switch,
} from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue, useRecoilValueLoadable } from "recoil";
import {
  catalogFiltersOptions,
  catalogFilterFamily,
} from "../../../utilities/atoms/catalogFilterAtoms";
import {
  fetchGeofilterSearchResults,
  geoFilterSearchText,
  geoFilterSelectedResult,
} from "../../../utilities/atoms/geofilterAtoms";
import useQueryParam, {
} from "../../../utilities/custom-hooks/useQueryParam";

export function ShowMapSwitch() {
  const history = useHistory();
  const map = useQueryParam().get("map");

  return (
    <Switch
      checkedChildren="hide map"
      unCheckedChildren="show map"
      defaultChecked={false}
      checked={map === "true"}
      onChange={() =>
        history.push({
          pathname: "/",
          search: `?map=${map === "true" ? false : true}`,
        })
      }
    />
  );
}

export function FilterCategorySelectionLengthIndicator({
  filterCategoryId,
  children,
  offset,
  size,
}) {
  const filterValue = useRecoilValue(catalogFilterFamily(filterCategoryId));

  return (
    <Badge offset={offset} size={size} count={filterValue.length}>
      {children}
    </Badge>
  );
}

export function FilterOptionSet({ filterOptions, category }) {
  return filterOptions.map((v, i) => (
    <FilterOption filterId={`${category}`} value={v} />
  ));
}
export function FilterOption({ filterId, value }) {
  const [filterValue, setFilterValue] = useRecoilState(
    catalogFilterFamily(filterId)
  );

  return (
    <Checkbox
      style={{ marginLeft: "0px", display: "block" }}
      checked={filterValue.includes(value)}
      onClick={() =>
        filterValue.includes(value)
          ? setFilterValue(filterValue.filter((v) => v !== value))
          : setFilterValue([...filterValue, value])
      }
    >
      {value}
    </Checkbox>
  );
}

export function GeoFilterSearchBar(props) {
  const { state, contents } = useRecoilValueLoadable(
    fetchGeofilterSearchResults
  );
  const [geoFilterText, setGeoFilterText] = useRecoilState(geoFilterSearchText);
  const [geoFilterSelection, setGeoFilterSelection] = useRecoilState(
    geoFilterSelectedResult
  );

  return (
    <Select
      suffixIcon={<EnvironmentOutlined />}
      showSearch
      placeholder="Search location"
      searchValue={geoFilterText}
      onSearch={(v) => setGeoFilterText(v)}
      showArrow={false}
      allowClear
      value={
        geoFilterSelection ? geoFilterSelection.properties.display_name : ""
      }
      onChange={(v) => setGeoFilterSelection(contents.features[v])}
      {...props}
    >
      {state !== "loading" &&
        contents &&
        contents.features.length > 0 &&
        contents.features.map((v, i) => (
          <Select.Option key={v.properties.place_id + "_" + i} value={i}>
            {v.properties.display_name}
          </Select.Option>
        ))}
    </Select>
  );
}

export function SearchBar() {
  /* const {
    map,
    pg,
    inc,
    sort,
    categories,
    availability,
    filetype,
    date,
    geography,
    bounds,
  } = useAllQueryParams(); */

  const filtersOptions = useRecoilValue(catalogFiltersOptions);
  const filterKeys = Object.keys(filtersOptions);

  return (
    <div className={"CatalogSearchBar"}>
      <div className={"SearchRow"}>
        <Input.Group compact>
          <Input
            style={{ width: "50%", minWidth: "300px" }}
            prefix={<SearchOutlined />}
            placeholder="Search collections by keyword"
          />
          <GeoFilterSearchBar style={{ width: "50%", minWidth: "300px" }} />
        </Input.Group>
      </div>

      <div className={"FilterRow"}>
        {filterKeys.map((v, i) => (
          <Popover
            key={`popover_${v}`}
            placement="bottomLeft"
            trigger="click"
            animation=""
            content={
              <Col>
                <FilterOptionSet
                  filterOptions={filtersOptions[v]}
                  category={v}
                />
              </Col>
            }
          >
            <Button>
              <FilterCategorySelectionLengthIndicator 
                children={v.replace("_", " ")}
                offset={[8,-4]}
                size="small"
                filterCategoryId={v}
              />
            </Button>
          </Popover>
        ))}
        <ShowMapSwitch />
      </div>
    </div>
  );
}

export function HeaderContainer(props) {
  return (
    <div className="HeaderBar">
      <Row className="BrandBar">
        <div className={"HeaderLogo"}>
          <Link to="/">
            <img
              className="TnrisLogo"
              src="https://data.tnris.org/static/media/tnris_logo.1b5d784b.svg"
              alt="TNRIS Logo"
              title="tnris.org"
            />
          </Link>
        </div>
      </Row>

      <SearchBar />
    </div>
  );
}
