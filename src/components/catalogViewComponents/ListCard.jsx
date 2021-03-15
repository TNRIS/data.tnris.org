import { Card, Col, Row, Tag } from "antd";
import { useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useRecoilValue } from "recoil";
import { mapAtom } from "../../utilities/atoms/mapAtoms";
import {
  highlightCoverage,
  removeHighlightCounties
} from "../../utilities/mapHelpers/highlightHelpers";

export function CatalogListCard({ collection }) {
  const map = useRecoilValue(mapAtom);

  useEffect(() => {
    //remove highlight when listcard leaves dom
    return () => removeHighlightCounties(map)
  },[map])

  return (
    <Card
      onMouseEnter={() => highlightCoverage(map, collection.the_geom)}
      onMouseLeave={() => removeHighlightCounties(map)}
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
