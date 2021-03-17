import { Button, Col, Empty, PageHeader, Row, Spin } from "antd";
import { Link } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { fetchCatalogCollectionsSelector } from "../../utilities/atoms/catalogAtoms";
import useQueryParam from "../../utilities/custom-hooks/useQueryParam";
import { CatalogListCard } from "./ListCard";
import { ViewMapSwitch } from "./ViewMapSwitch";
import { CatalogPaginationControls } from "./PaginationControls";
import { FilterBar } from "./filterBarComponents/FilterBar";

export function CatalogList() {
  const map = useQueryParam().get("map");
  const { state, contents } = useRecoilValueLoadable(
    fetchCatalogCollectionsSelector
  );

  return (
    <Col id={"CatalogViewContainer"}>
      <div>
        <div className={"FilterRow"}>
          <FilterBar />
        </div>
        <PageHeader
          subTitle={<ViewMapSwitch />}
          extra={<CatalogPaginationControls />}
        />
      </div>
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
          {contents.results && contents.results.length === 0 && (
            <Empty description={"No results found for that search query"}>
              <Button type="outline">Clear Search</Button>
            </Empty>
          )}
        </Spin>
      </div>
    </Col>
  );
}
