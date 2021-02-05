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
} from "../utilities/atoms/catalogFilterAtoms";
import {
  fetchGeofilterSearchResults,
  geoFilterSearchText,
  geoFilterSelectedResult,
} from "../utilities/atoms/geofilterAtoms";
import useQueryParam from "../utilities/custom-hooks/useQueryParam";

export function MapViewSwitch() {
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

// a component that shows the number of selected filters in a specified filter type.
// shows the count in a Badge component from Ant Design
export function FilterCategorySelectionLengthIndicator({
  filterAtomFamily,
  filterKey,
  children,
  offset,
  size,
}) {
  const filterValue = useRecoilValue(filterAtomFamily(filterKey));
  return (
    <Badge offset={offset} size={size} count={filterValue.length}>
      {children}
    </Badge>
  );
}

// a component that returns a stateful checkbox, state being stored in a designated atomFamily
// filterAtomFamily is a pointer to an atomFamily in which to store key-value pairs
// filterKey is the key/id used to get corresponding value from atomFamily state
export function FilterOption({ filterKey, value, filterAtomFamily }) {
  const [filterValue, setFilterValue] = useRecoilState(
    filterAtomFamily(filterKey)
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
  const [geoSearchInputText, setGeoSearchInputText] = useRecoilState(
    geoFilterSearchText
  );
  const [geoFilterSelection, setGeoFilterSelection] = useRecoilState(
    geoFilterSelectedResult
  );

  return (
    <Select
      suffixIcon={<EnvironmentOutlined />}
      showSearch
      placeholder="Search location"
      searchValue={geoSearchInputText}
      onSearch={(v) => setGeoSearchInputText(v)}
      showArrow={false}
      filterOption={false}
      allowClear
      onClear={ () => setGeoFilterSelection(null) }
      value={
        geoFilterSelection ? geoFilterSelection.properties.display_name : null
      }
      onChange={(v) => setGeoFilterSelection(contents.features[v])}
      {...props}
    >
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

export function SearchBar() {
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
        {filterKeys.map((key, i) => (
          <Popover
            key={`popover_${key}`}
            placement="bottomLeft"
            trigger="click"
            animation=""
            content={
              <Col>
                {filtersOptions[key].map((option) => (
                  <FilterOption
                    key={key + "_" + option}
                    filterKey={key}
                    filterAtomFamily={catalogFilterFamily}
                    value={option}
                  />
                ))}
              </Col>
            }
          >
            <Button>
              <FilterCategorySelectionLengthIndicator
                children={key.replace("_", " ")}
                offset={[8, -4]}
                size="small"
                filterKey={key}
                filterAtomFamily={catalogFilterFamily}
              />
            </Button>
          </Popover>
        ))}
        <MapViewSwitch />
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
