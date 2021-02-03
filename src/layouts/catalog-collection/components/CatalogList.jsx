import { Card, Col, PageHeader, Pagination, Row, Spin, Tag } from "antd";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValueLoadable, useSetRecoilState } from "recoil";
import {
  catalogIncrement,
  catalogPage,
  fetchCatalogCollectionsSelector,
} from "../../../utilities/atoms/catalogAtoms";
import { hoverPreviewCoverageCounties } from "../../../utilities/atoms/geofilterAtoms";
import {
  useAllQueryParams,
} from "../../../utilities/custom-hooks/useQueryParam";

export function CatalogList() {
  const setPreviewCounties = useSetRecoilState(hoverPreviewCoverageCounties)
  const [page, setPage] = useRecoilState(catalogPage);
  const [increment, setIncrement] = useRecoilState(catalogIncrement);
  const {
    map,
    /* pg,
    inc,
    sort,
    categories,
    availability,
    filetype,
    date,
    geography,
    bounds, */
  } = useAllQueryParams();
  const { state, contents } = useRecoilValueLoadable(
    fetchCatalogCollectionsSelector
  );

  return (
    <Spin
      spinning={state === "loading"}
      tip={"Loading data collections, please wait"}
    >
      {contents.results && contents.results.length > 0 && (
        <>
          <PageHeader
            extra={
              <Pagination
                size="small"
                showQuickJumper
                responsive
                pageSizeOptions={[12, 24, 60, 120]}
                current={page}
                pageSize={increment}
                onChange={(pg, inc) => {
                  if (pg !== page) {
                    setPage(pg);
                  }
                  if (inc !== increment) {
                    setIncrement(inc);
                  }
                }}
                total={contents.count}
              />
            }
          />
          <Row gutter={[8, 8]} style={{ padding: "8px" }}>
            {contents.results.length > 0 &&
              contents?.results?.map((v, i) => (
                <Col
                  sm={{ span: 24 }}
                  md={{ span: map === "true" ? 24 : 12 }}
                  lg={{ span: map === "true" ? 24 : 8 }}
                  xxl={{ span: map === "true" ? 24 : 6 }}
                  key={v.collection_id}
                >
                  <Link to={`/collection?c=${v.collection_id}`}>
                    <Card
                      onMouseEnter={ () => setPreviewCounties(v.counties.split(", ")) }
                      size={"small"}
                      hoverable
                      height={"300px"}
                      extra={new Date().getFullYear(v.acquisition_date)}
                      title={v.name}
                    >
                      <Row gutter={[8, 0]}>
                        <Col span={6}>
                          <LazyLoadImage
                            alt={`${v.name} thumbnail`}
                            width={"100%"}
                            src={v.thumbnail_image}
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
                            {v.category &&
                              v.category
                                .split(",")
                                .map((v) => (
                                  <Tag key={v}>{v.replace("_", " ")}</Tag>
                                ))}
                          </Row>
                          <Row>Availability</Row>
                          <Row>
                            {v.availability && (
                              <Tag>{v.availability.replace("_", " ")}</Tag>
                            )}
                            {v.wms_link && <Tag>WMS</Tag>}
                          </Row>
                        </Col>
                      </Row>
                    </Card>
                  </Link>
                </Col>
              ))}
          </Row>
          <Row>
            <Pagination
              size="small"
              showQuickJumper
              responsive
              pageSizeOptions={[12, 24, 60, 120]}
              current={page}
              pageSize={increment}
              onChange={(pg, inc) => {
                if (pg !== page) {
                  setPage(pg);
                }
                if (inc !== increment) {
                  setIncrement(inc);
                }
              }}
              total={contents.count}
            />
          </Row>
        </>
      )}
    </Spin>
  );
}
