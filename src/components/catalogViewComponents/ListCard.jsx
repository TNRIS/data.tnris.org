import { Col, Row, Tag } from "antd";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { mapAtom } from "../../atoms/mapAtoms";
import useQueryParam from "../../utilities/customHooks/useQueryParam";
import {
  addCoverageLayer,
  removeCoverageLayer,
} from "../../utilities/mapHelpers/highlightHelpers";
import { LazyBackgroundImage } from "../LazyBackgroundImage";

export function CatalogListCard({ collection }) {
  const geo = useQueryParam().get("geo")
  const map = useRecoilValue(mapAtom);
  const hoverTimer = useRef(null);

  useEffect(() => {
    //remove highlight when listcard leaves dom
    return () => removeCoverageLayer(map);
  }, [map]);

  return (
    <Link
      to={{
        pathname: `/collection`,
        search: geo ? `?c=${collection.collection_id}&geo=${geo}` : `?c=${collection.collection_id}`
      }}
    >
      <div
        className="CatalogCard"
        onMouseEnter={() => {
          hoverTimer.current = setTimeout(() => {
            removeCoverageLayer(map);
            addCoverageLayer(map, collection.the_geom);
            //zoomToFeatures(map, collection.the_geom);
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
              <Col span={24} className="CatalogCardMetaTagContainer">
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
              <Col span={24} className="CatalogCardMetaTagContainer">
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
    </Link>
  );
}
