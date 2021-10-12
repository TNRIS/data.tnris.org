import { DownOutlined } from "@ant-design/icons";
import { Badge, Button, Checkbox, Col, Popover, Row } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { catalogFiltersOptions } from "../../../atoms/catalogFilterAtoms";
import { changeParams } from "../../../utilities/changeParamsUtil";
import useQueryParam from "../../../utilities/customHooks/useQueryParam";
import { ClearAllFilters } from "./ClearAllFilters";
import { DateRange } from "./DateRange";
import { Sort } from "./Sort";

export function FilterBar() {
  const filterOptions = useRecoilValue(catalogFiltersOptions);
  return (
    <Row justify="start" style={{ rowGap: ".25rem" }} className="FilterBar">
      {Object.entries(filterOptions).map((set, i) => (
        <Popover
          key={set[0] + "+" + i}
          trigger={"click"}
          placement="bottomLeft"
          content={
            <Col>
              {set[1].map((opt) => (
                <FilterOption
                  key={set[0] + "+" + opt}
                  filterSet={set[0]}
                  value={opt}
                />
              ))}
              <ToggleAllOptions set={set} />
            </Col>
          }
        >
          <Button shape="round">
            <FilterCountBadge filterSet={set[0]}>
              <Badge>
                <span style={{ textTransform: "capitalize" }}>
                  {set[0].replace("_", " ")}{" "}
                  <DownOutlined style={{ fontSize: "10px" }} />
                </span>
              </Badge>
            </FilterCountBadge>
          </Button>
        </Popover>
      ))}

      <Popover
        key={"datepicker"}
        trigger={"click"}
        placement="bottomLeft"
        content={<DateRange />}
      >
        <Button shape="round">
          <FilterCountBadge>
            <Badge>
              <span style={{ textTransform: "capitalize" }}>
                date range{" "}
                <DownOutlined size="10px" style={{ fontSize: "10px" }} />
              </span>
            </Badge>
          </FilterCountBadge>
        </Button>
      </Popover>

      <Sort />

      <ClearAllFilters />
    </Row>
  );
}
export function ToggleAllOptions({ set }) {
  const history = useHistory();
  const { search } = useLocation();
  const selected = useQueryParam().get(set[0]);

  const indeterminate =
    selected &&
    !!selected.split(",").length &&
    selected.split(",").length < set[1].length;

  const allSelected =
    selected &&
    !!selected.split(",").length &&
    selected.split(",").sort().toString() === set[1].sort().toString();

  const onCheckAllChange = () => {
    if (allSelected) {
      history.push({
        search: changeParams(
          [{ key: set[0], value: null, ACTION: "delete" }],
          search
        ),
      });
    } else {
      history.push({
        search: changeParams(
          [{ key: set[0], value: set[1].toString(), ACTION: "set" }],
          search
        ),
      });
    }
  };
  return (
    <>
      <hr />
      <Row>
        <Checkbox
          indeterminate={indeterminate}
          checked={allSelected}
          onChange={onCheckAllChange}
        >
          {allSelected ? "Uncheck All" : "Check All"}
        </Checkbox>
      </Row>
    </>
  );
}

export function FilterOption({ filterSet, value }) {
  const history = useHistory();
  const { search } = useLocation();
  const param = useQueryParam().get(filterSet);
  const paramArray = param ? param.split(",") : [];
  const selected = paramArray.includes(value);
  const setOrDelete = selected && paramArray.length === 1 ? "delete" : "set";

  const toggle = () =>
    history.push({
      pathname: "/",
      search: changeParams(
        [
          {
            key: filterSet,
            value: selected
              ? paramArray.filter((v) => v !== value)
              : [...paramArray, value],
            ACTION: setOrDelete,
          },
        ],
        search
      ),
    });
  return (
    <Row>
      <Checkbox checked={selected} onClick={toggle}>
        {value.replace("_", " ")}
      </Checkbox>
    </Row>
  );
}

export function FilterCountBadge({ filterSet, offset, children }) {
  const param = useQueryParam().get(filterSet);

  return (
    <Badge
      style={{ background: "#1e8dc1" }}
      size="small"
      offset={[8, -4]}
      count={param && param.split(",").length}
    >
      {children}
    </Badge>
  );
}
