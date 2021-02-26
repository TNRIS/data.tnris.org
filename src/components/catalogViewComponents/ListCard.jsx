import { Card, Col, Row, Tag } from "antd";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useRecoilValue } from "recoil";
import { mapAtom } from "../../utilities/atoms/mapAtoms";

export function CatalogListCard({ collection }) {
  const map = useRecoilValue(mapAtom);
  const highlightCounties = (counties) => {
    if (map) {
      const addFn = () =>
        map.addLayer({
          id: "catalog-hover",
          type: "fill",
          source: "area-type-source",
          "source-layer": "area_type",
          minzoom: 2,
          maxzoom: 24,
          paint: {
            "fill-color": "black",
            "fill-opacity": 0.4,
          },
          filter: [
            "all",
            ["==", "area_type", "county"],
            ["in", "area_type_name", ...counties],
          ],
        });

      if (counties && counties.length >= 1) {
        //console.log("drawing new layer")
        addFn();
      }
    }
  };
  const removeHighlightedCounties = () => {
    if(map && map.getLayer("catalog-hover") !== "undefined"){
      map.removeLayer("catalog-hover")
    }
  }
  return (
    <Card
      onMouseEnter={() => highlightCounties(collection.counties.split(", "))}
      onMouseLeave={() => removeHighlightedCounties()}
      size={"small"}
      hoverable
      height={"300px"}
      extra={new Date().getFullYear(collection.acquisition_date)}
      title={collection.name}
    >
      <Row gutter={[8, 0]}>
        <Col span={6}>
          <LazyLoadImage
            alt={`${collection.name} thumbnail`}
            width={"100%"}
            src={collection.thumbnail_image}
            threshold={100}
            placeholder={
              <img
                alt={`Loading...`}
                style={{
                  width: "80px",
                  height: "45px",
                  background: "#efefef",
                }}
              />
            }
          />
        </Col>
        <Col span={18}>
          <Row>Categories</Row>
          <Row>
            {collection.category &&
              collection.category
                .split(",")
                .map((v) => <Tag key={v}>{v.replace("_", " ")}</Tag>)}
          </Row>
          <Row>Availability</Row>
          <Row>
            {collection.availability && (
              <Tag>{collection.availability.replace("_", " ")}</Tag>
            )}
            {collection.wms_link && <Tag>WMS</Tag>}
          </Row>
        </Col>
      </Row>
    </Card>
  );
}
