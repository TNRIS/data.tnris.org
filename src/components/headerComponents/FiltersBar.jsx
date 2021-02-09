import { Badge, Button, Checkbox, Col, Dropdown, Row, Space } from "antd";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  catalogFilterFamily,
  catalogFiltersOptions,
} from "../../utilities/atoms/catalogFilterAtoms";
import useQueryParam from "../../utilities/custom-hooks/useQueryParam";

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
      <Checkbox checked={filterValue.includes(filterOption)} onClick={handleOptionClick}>{filterOption}</Checkbox>
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

export function FilterOptionsDropdown({filterSet, filtersSets}) {
  const filterParam = useQueryParam().get(filterSet);
  const setFilterValue = useSetRecoilState(catalogFilterFamily(filterSet))
  useEffect(() => {
    if (filterParam && filterParam.length) {
      setFilterValue(filterParam.split(","));
    }
  }, [filterParam, setFilterValue]);

  return (
    <Dropdown
      key={`popover_${filterSet}`}
      placement="bottomLeft"
      trigger="click"
      overlay={
        <Space size={[4, 4]}>
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
              <Button size="small" type="primary" block={true}>
                Apply Filters
              </Button>
            </Row>
          </Col>
        </Space>
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
    </Dropdown>
  );
}

export function FiltersBar() {
  const filtersOptions = useRecoilValue(catalogFiltersOptions);
  const filterKeys = Object.keys(filtersOptions);

  return (
    <>
      {filterKeys.map((key, i) => (
        <FilterOptionsDropdown 
          filterSet={key}
          filtersSets={filtersOptions}
        />
      ))}
    </>
  );
}
