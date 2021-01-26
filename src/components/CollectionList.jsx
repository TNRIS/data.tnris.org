import { Card, Col, Pagination, Row, Spin, Tag } from "antd";
import { Header } from "antd/lib/layout/layout";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValueLoadable } from "recoil";
import {
  catalogIncrement,
  catalogPage,
  fetchCollectionsSelector,
} from "../utilities/atoms/collectionsAtoms";

export function CollectionList({ mapview = "true" }) {
  const { state, contents } = useRecoilValueLoadable(fetchCollectionsSelector);
  const [page, setPage] = useRecoilState(catalogPage);
  const [increment, setIncrement] = useRecoilState(catalogIncrement);

  return (
    <Spin spinning={state === "loading"} tip={"Loading data collections, please wait"} >
      {contents.results && contents.results.length > 0 && (
        <>
          <Row>
            <Header>
              <Link to={mapview === "true" ? "/?map=false" : "/?map=true"}>
                {mapview === "true" ? "Close Map" : "Show Map"}
              </Link>
            </Header>
          </Row>
          <Row gutter={[8, 8]}>
            {contents.results.length > 0 &&
              contents?.results?.map((v, i) => (
                <Col
                  sm={{ span: 24 }}
                  md={{ span: mapview === "true" ? 24 : 12 }}
                  lg={{ span: mapview === "true" ? 24 : 8 }}
                  xxl={{ span: mapview === "true" ? 24 : 6 }}
                  key={v.collection_id}
                >
                  <Link to={`/collection?c=${v.collection_id}`}>
                    <Card
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
          <Pagination
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
        </>
      )}
    </Spin>
  );
}
