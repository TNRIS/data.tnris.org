import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { GeoFilterSearchBar } from "./GeoFilterSearchBar";

export function SearchBar() {
  return (
    <>
    <Input.Group compact>
      <Input
        style={{ width: "50%", minWidth: "300px" }}
        prefix={<SearchOutlined />}
        placeholder="Search collections by keyword"
      />
      <GeoFilterSearchBar style={{ width: "50%", minWidth: "300px" }} />
    </Input.Group>
    </>
  );
}
