import { Card, Col, Row, Tag } from "antd";
import { useEffect, useRef } from "react";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { useRecoilValue } from "recoil";
import { mapAtom } from "../../utilities/atoms/mapAtoms";
import {
  addCoverageLayer,
  removeCoverageLayer,
} from "../../utilities/mapHelpers/highlightHelpers";
import { zoomToFeatures } from "../../utilities/mapHelpers/zoomHelpers";
import { LazyBackgroundImage } from "../LazyBackgroundImage";

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
        hoverTimer.current = setTimeout(() => {
          addCoverageLayer(map, collection.the_geom);
          zoomToFeatures(map, collection.the_geom);
        }, 1000);
      }}
      onMouseLeave={() => {
        removeCoverageLayer(map, collection.the_geom);
        clearTimeout(hoverTimer.current);
      }}
      size={"small"}
      hoverable
      height={"300px"}
      cover={
        <LazyLoadComponent threshold={100} useIntersectionObserver={true}>
          <LazyBackgroundImage
            src={collection.thumbnail_image}
            style={{
              minHeight: "100px",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }}
          />
        </LazyLoadComponent>
      }
      title={
        <span>
          {collection.name}{" "}
          <small style={{ paddingLeft: "1vw" }}>
            <em>{new Date(collection.acquisition_date).getFullYear()}</em>
          </small>
        </span>
      }
      className="CatalogCard"
    >
      <Row gutter={[8, 0]}>
        <Col span={24} className="CatalogCardMetaTagContainer">
          <Row>Categories</Row>
          <Row>
            {collection.category &&
              collection.category.split(",").map((v) => (
                <Tag color="blue" key={v}>
                  {v.replace("_", " ")}
                </Tag>
              ))}
          </Row>
        </Col>
        <Col span={24} className="CatalogCardMetaTagContainer">
          <Row>Availability</Row>
          <Row>
            {collection.availability && (
              <Tag color="green">
                {collection.availability.replace("_", " ")}
              </Tag>
            )}
            {collection.wms_link && <Tag color="green">WMS</Tag>}
          </Row>
        </Col>
      </Row>
    </Card>
  );
}
