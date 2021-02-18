import { Badge, Button, Checkbox, Col, Popover, Row } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { catalogFiltersOptions } from "../../utilities/atoms/catalogFilterAtoms";
import { changeParams } from "../../utilities/changeParamsUtil";
import useQueryParam from "../../utilities/custom-hooks/useQueryParam";

export function FilterBar() {
  const filterOptions = useRecoilValue(catalogFiltersOptions);

  return (
    <>
      {Object.entries(filterOptions).map((set, i) => (
        <Popover
          key={set[0] + "+" + i}
          trigger={"click"}
          placement="bottomLeft"
          content={
            <Col>
              {set[1].map((opt) => (
                <FiltersOption filterSet={set[0]} value={opt} />
              ))}
            </Col>
          }
        >
          <Button>
          <FilterCountBadge filterSet={set[0]}><Badge>{set[0].replace("_", " ")}</Badge></FilterCountBadge>
          </Button>
        </Popover>
      ))}
    </>
  );
}

export function FiltersOption({ filterSet, value }) {
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

  return <Badge style={{background: "#1e8dc1",}} size="small" offset={[8,-4]} count={param && param.split(",").length}>{children}</Badge>;
}
