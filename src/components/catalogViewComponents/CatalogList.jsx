import { Col, Empty, Input, PageHeader, Row, Spin } from "antd";
import { Link } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import { fetchCatalogCollectionsSelector } from "../../utilities/atoms/catalogAtoms";
import useQueryParam from "../../utilities/custom-hooks/useQueryParam";
import { GeoFilterSearchBar } from "./filterBarComponents/GeoFilterSearchBar";
import { KeywordSearchBar } from "./filterBarComponents/KeywordSearchBar";
import { ClearAllFilters } from "./filterBarComponents/ClearAllFilters";
import { FilterBar } from "./filterBarComponents/FilterBar";
import { CatalogListCard } from "./ListCard";
import { CatalogPaginationControls } from "./PaginationControls";
import { ViewMapSwitch } from "./ViewMapSwitch";

export function CatalogList() {
  const map = useQueryParam().get("map");
  const { state, contents } = useRecoilValueLoadable(
    fetchCatalogCollectionsSelector
  );

  return (
    <Col id={"CatalogViewContainer"}>
      <div>
        <Input.Group className="CatalogSearchBar">
          <KeywordSearchBar />
          <GeoFilterSearchBar />
        </Input.Group>
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
                      xxl={{ span: map === "true" ? 12 : 6 }}
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
              <ClearAllFilters />
            </Empty>
          )}
        </Spin>
      </div>
    </Col>
  );
}
