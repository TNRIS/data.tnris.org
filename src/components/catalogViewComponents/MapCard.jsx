import { Col, Row, Tag } from "antd";
import { useEffect, useRef } from "react";
import {
  addCoverageLayer,
  removeCoverageLayer,
} from "../../utilities/mapHelpers/highlightHelpers";
import { LazyBackgroundImage } from "../LazyBackgroundImage";

export function CatalogMapCard({ collection, map, history }) {
  const hoverTimer = useRef(null);

  useEffect(() => {
    //remove highlight when listcard leaves dom
    return () => removeCoverageLayer(map);
  }, [map]);

  return (
    <div
      onClick={() => history.push(`/collection?c=${collection.collection_id}`)}
      className="CatalogCard MapCard"
      onMouseEnter={() => {
        hoverTimer.current = setTimeout(() => {
          removeCoverageLayer(map);
          addCoverageLayer(map, JSON.parse(collection.the_geom));
          //zoomToFeatures(map, collection.the_geom);
        }, 1000);
      }}
      onMouseLeave={() => {
        clearTimeout(hoverTimer.current);
      }}
      size={"small"}
    >
      <LazyBackgroundImage
        className="CollectionCardBackground MapCard"
        src={collection.thumbnail_image}
      >
        <div className="CollectionCardOverlay MapCard">
          <h3
            title={collection.name}
            className={"CollectionTitle MapCard"}
          >
            {collection.name}
          </h3>

          <Row gutter={[8, 0]}>
            <Col span={24} className="CatalogCardMetaTagContainer MapCard">
              <Row>
                <Tag
                  style={{
                    border: "1px solid #C2960C",
                    color: "#C2960C",
                    background: "#00000070",
                    textShadow: "1px 1px black",
                  }}
                >
                  <strong>
                    {new Date(collection.acquisition_date).getFullYear()}
                  </strong>
                </Tag>
              </Row>
            </Col>
            <Col span={24} className="CatalogCardMetaTagContainer MapCard">
              <Row>
                {collection.category &&
                  collection.category.split(",").map((v) => (
                    <Tag
                      style={{
                        border: "1px solid #15C29B",
                        color: "#15C29B",
                        background: "#00000070",
                        textShadow: "1px 1px black",
                      }}
                      key={v}
                    >
                      <strong>{v.replace("_", " ")}</strong>
                    </Tag>
                  ))}
              </Row>
            </Col>
            <Col span={24} className="CatalogCardMetaTagContainer MapCard">
              <Row>
                {collection.availability &&
                  collection.availability.split(",").map((v) => (
                    <Tag
                      key={v}
                      style={{
                        border: "1px solid #fff",
                        color: "#fff",
                        background: "#00000070",
                        textShadow: "1px 1px black",
                      }}
                    >
                      <strong>{v.replace("_", " ")}</strong>
                    </Tag>
                  ))}
              </Row>
            </Col>
          </Row>
        </div>
      </LazyBackgroundImage>
    </div>
  );
}
