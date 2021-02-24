import { Col, PageHeader, Row, Spin } from "antd";
import { Link } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { fetchCatalogCollectionsSelector } from "../../utilities/atoms/catalogAtoms";
import useQueryParam from "../../utilities/custom-hooks/useQueryParam";
import { CatalogListCard } from "./ListCard";
import { MapViewSwitch } from "./MapViewSwitch";
import { CatalogPaginationControls } from "./PaginationControls";

export function CatalogList() {
  const map = useQueryParam().get("map");
  const { state, contents } = useRecoilValueLoadable(
    fetchCatalogCollectionsSelector
  );

  return (
    <Col id={"CatalogViewContainer"}>
      <PageHeader
        subTitle={<MapViewSwitch />}
        extra={<CatalogPaginationControls />}
      />
      <div id={"CatalogListContainer"}>
        <Spin
          spinning={state === "loading"}
          tip={"Loading data collections, please wait"}
        >
          {contents.results && contents.results.length > 0 && (
            <>
              <Row gutter={[8, 8]} style={{ padding: "8px" }}>
                {contents.results.length > 0 &&
                  contents?.results?.map((v) => (
                    <Col
                      sm={{ span: 24 }}
                      md={{ span: map === "true" ? 24 : 12 }}
                      lg={{ span: map === "true" ? 24 : 8 }}
                      xxl={{ span: map === "true" ? 24 : 6 }}
                      key={v.collection_id}
                    >
                      <Link to={`/collection?c=${v.collection_id}`}>
                        <CatalogListCard collection={v} />
                      </Link>
                    </Col>
                  ))}
              </Row>
            </>
          )}
        </Spin>
      </div>
    </Col>
  );
}
