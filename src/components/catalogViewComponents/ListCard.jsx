import { Card, Col, Row, Tag } from "antd";
import { useEffect, useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useRecoilValue } from "recoil";
import { mapAtom } from "../../utilities/atoms/mapAtoms";
import {
  addCoverageLayer,
  removeCoverageLayer
} from "../../utilities/mapHelpers/highlightHelpers";
import { zoomToFeatures } from "../../utilities/mapHelpers/zoomHelpers";

export function CatalogListCard({ collection }) {
  const map = useRecoilValue(mapAtom);
  const hoverTimer = useRef(null);

  useEffect(() => {
    //remove highlight when listcard leaves dom
    return () => removeCoverageLayer(map);
  }, [map]);

  return (
    <Card
      onMouseEnter={() => {
        hoverTimer.current = setTimeout(
          () => {
            addCoverageLayer(map, collection.the_geom)
            zoomToFeatures(map, collection.the_geom)
          },
          1000
        );
      }}
      onMouseLeave={() => {
        removeCoverageLayer(map, collection.the_geom);
        clearTimeout(hoverTimer.current);
      }}
      size={"small"}
      hoverable
      height={"300px"}
      extra={new Date(collection.acquisition_date).getFullYear()}
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
