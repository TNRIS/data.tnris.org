import { Col, InputNumber, Row, Slider } from "antd";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { changeParams } from "../../../utilities/changeParamsUtil";
import useQueryParam from "../../../utilities/custom-hooks/useQueryParam";

export function DateRange() {
  const history = useHistory();
  const { search } = useLocation();
  const dates = useQueryParam().get("dates");
  const dateParamToArray = dates
    ? dates.split(",")
    : [1835, new Date().getFullYear()];
  const [min, setMin] = useState(dateParamToArray[0]);
  const [max, setMax] = useState(dateParamToArray[1]);

  useEffect(() => {}, [min, max]);

  return (
    <Row style={{ minWidth: "240px" }}>
      <Col span={24}>
        <Row>
          <Col span={24}>
            <h5>Date Range</h5>
            <Slider
              step={1}
              range
              min={1835}
              onChange={(v) => {
                setMin((min) => v[0]);
                setMax((max) => v[1]);
                history.push({
                  search: changeParams(
                    [{ key: "dates", value: `${v[0]},${v[1]}`, ACTION: "set" }],
                    search
                  ),
                });
              }}
              max={
                new Date().getFullYear() - (new Date().getFullYear() % 5) + 5
              }
              defaultValue={[min, max]}
              value={[min, max]}
            />
          </Col>
        </Row>
        <Row justify="space-between">
          <Col span={10}>
            <InputNumber
              value={min}
              step={1}
              onChange={(v) => {
                setMin((min) => v);
                history.push({
                  search: changeParams(
                    [{ key: "dates", value: `${v},${max}`, ACTION: "set" }],
                    search
                  ),
                });
              }}
              min={1835}
              max={max - 1}
              size="small"
            />
          </Col>
          <Col span={10}>
            <InputNumber
              value={max}
              step={1}
              onChange={(v) => {
                setMax((max) => v);
                history.push({
                  search: changeParams(
                    [{ key: "dates", value: `${min},${v}`, ACTION: "set" }],
                    search
                  ),
                });
              }}
              min={1835}
              max={
                new Date().getFullYear() - (new Date().getFullYear() % 5) + 5
              }
              size="small"
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
