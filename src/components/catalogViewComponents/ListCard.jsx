import { Col, Row, Tag } from "antd";
import { useEffect, useRef } from "react";
import { LazyLoadComponent } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { mapAtom } from "../../utilities/atoms/mapAtoms";
import {
  addCoverageLayer,
  removeCoverageLayer
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
    <Link to={`/collection?c=${collection.collection_id}`}>
      <LazyLoadComponent
        threshold={100}
        useIntersectionObserver={true}
        style={{
          width: "100%",
          height: "200px",
        }}
        placeholder={<div className="CatalogCard"></div>}
      >
        <div
          className="CatalogCard"
          onMouseEnter={() => {
            hoverTimer.current = setTimeout(() => {
              removeCoverageLayer(map, collection.the_geom);
              addCoverageLayer(map, collection.the_geom);
              zoomToFeatures(map, collection.the_geom);
            }, 1000);
          }}
          onMouseLeave={() => {
            clearTimeout(hoverTimer.current);
          }}
          size={"small"}
        >
          <LazyBackgroundImage
            className="CollectionCardBackground"
            src={collection.thumbnail_image}
          >
            <div className="CollectionCardOverlay">
              <h3 title={collection.name} className={"CollectionTitle"}>
                {collection.name}
              </h3>

              <Row gutter={[8, 0]}>
                <Col span={24} className="CatalogCardMetaTagContainer">
                  <Row>
                    <Tag color="default">
                      {new Date(collection.acquisition_date).getFullYear()}
                    </Tag>
                  </Row>
                </Col>
                <Col span={24} className="CatalogCardMetaTagContainer">
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
                  <Row>
                    {collection.availability &&
                      collection.availability.split(",").map((v) => (
                        <Tag key={v} color="green">
                          {v.replace("_", " ")}
                        </Tag>
                      ))}
                  </Row>
                </Col>
              </Row>
            </div>
          </LazyBackgroundImage>
        </div>
      </LazyLoadComponent>
    </Link>
  );
}
