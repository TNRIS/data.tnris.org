import { Badge, Button, Checkbox, Col, Popover, Row } from "antd";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  catalogFilterFamily,
  catalogFiltersOptions,
} from "../../utilities/atoms/catalogFilterAtoms";
import useQueryParam from "../../utilities/custom-hooks/useQueryParam";
import { changeParams } from "../../utilities/changeParamsUtil";

export function FilterOption({ filterSet, filterOption, filterAtomFamily }) {
  const [filterValue, setFilterValue] = useRecoilState(
    filterAtomFamily(filterSet)
  );
  const handleOptionClick = () =>
    filterValue.includes(filterOption)
      ? setFilterValue(filterValue.filter((v) => v !== filterOption))
      : setFilterValue([...filterValue, filterOption]);
  return (
    <Row>
      <Checkbox
        checked={filterValue.includes(filterOption)}
        onClick={handleOptionClick}
      >
        {filterOption}
      </Checkbox>
    </Row>
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

export function FilterOptionsDropdown({ filterSet, filtersSets }) {
  const history = useHistory();
  const {search} = useLocation();
  const filterParam = useQueryParam().get(filterSet);
  const [filterValue, setFilterValue] = useRecoilState(
    catalogFilterFamily(filterSet)
  );
  useEffect(() => {
    if (filterParam && filterParam.length) {
      setFilterValue(filterParam.split(","));
    }
  }, [filterParam, setFilterValue]);


  return (
    <Popover
      trigger={"click"}
      placement="bottomLeft"
      content={
        <Col>
          {filtersSets[filterSet].map((option) => (
            <FilterOption
              key={`${filterSet}_${option}`}
              filterSet={filterSet}
              filterOption={option}
              filterAtomFamily={catalogFilterFamily}
            />
          ))}
          <hr />
          <Row>
            <Button
              size="small"
              type="primary"
              block={true}
              onClick={() => history.push({
                pathname: "/",
                search: changeParams([
                  { key: filterSet, value: filterValue, ACTION: filterValue.length ? "set" : "delete" }
                ], search)
              })}
            >
              Apply Filters
            </Button>
          </Row>
        </Col>
      }
    >
      <Button>
        <FilterCategorySelectionLengthIndicator
          children={filterSet.replace("_", " ")}
          offset={[8, -4]}
          size="small"
          filterKey={filterSet}
          filterAtomFamily={catalogFilterFamily}
        />
      </Button>
    </Popover>
  );
}

export function FiltersBar() {
  const filtersOptions = useRecoilValue(catalogFiltersOptions);
  const filterKeys = Object.keys(filtersOptions);

  return (
    <>
      {filterKeys.map((key) => (
        <FilterOptionsDropdown
          key={`dropdown_${key}`}
          filterSet={key}
          filtersSets={filtersOptions}
        />
      ))}
    </>
  );
}
