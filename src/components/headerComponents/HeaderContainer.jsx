import { Checkbox, Row } from "antd";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import { CartIndicator } from "./CartIndicator";

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

export function HeaderContainer(props) {
  return (
    <div className="HeaderBar">
      <Row className="BrandBar">
        <div className={"HeaderLogo"}>
          <Link to="/">
            <img
              className="TnrisLogo"
              src="https://cdn.tnris.org/images/tnris_logo.svg"
              alt="TNRIS Logo"
              title="data.tnris.org"
            />
          </Link>
        </div>
      </Row>
      <CartIndicator />
    </div>
  );
}
