import { Card, Col, Row, Tag } from "antd";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSetRecoilState } from "recoil";
import { hoverPreviewCoverageCounties } from "../../utilities/atoms/geofilterAtoms";

export function CatalogListCard({collection}) {
  const setPreviewCounties = useSetRecoilState(hoverPreviewCoverageCounties);

  return (
    <Card
      onMouseEnter={() => setPreviewCounties(collection.counties.split(", "))}
      onMouseLeave={() => setPreviewCounties([])}
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
            {collection.availability && <Tag>{collection.availability.replace("_", " ")}</Tag>}
            {collection.wms_link && <Tag>WMS</Tag>}
          </Row>
        </Col>
      </Row>
    </Card>
  );
}
