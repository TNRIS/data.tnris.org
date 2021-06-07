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
import { useEffect, useState } from "react";

export function LazyBackground(props) {
  const [source, setSource] = useState(null);

  useEffect(() => {
    const { src } = props;

    const imageLoader = new Image();
    imageLoader.src = src;

    imageLoader.onload = () => {
      setSource({ src });
    };
  }, [props]);

  return (
    <div
      {...props}
      style={{
        backgroundImage: `url(${source || props.placeholder})`,
      }}
    />
  );
}

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
          className="CatalogHeaderControlPanel"
        />
      </div>
      <div id={"CatalogListContainer"}>
        <Spin
          spinning={state === "loading"}
          tip={"Loading data collections, please wait"}
        >
          {contents.results && contents.results.length > 0 && (
            <>
              <div
                className="CatalogGrid"
              >
                {contents.results.length > 0 &&
                  contents?.results?.map((v) => (
                    <div key={v.collection_id}>
                      <Link to={`/collection?c=${v.collection_id}`}>
                        <CatalogListCard collection={v} />
                      </Link>
                    </div>
                  ))}
              </div>
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
