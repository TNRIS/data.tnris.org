import { Col, Empty, Input, PageHeader, Spin } from "antd";
import { useEffect, useState } from "react";
import { useRecoilValueLoadable } from "recoil";
import { fetchCatalogCollectionsSelector } from "../../utilities/atoms/catalogAtoms";
import { ClearAllFilters } from "./filterBarComponents/ClearAllFilters";
import { FilterBar } from "./filterBarComponents/FilterBar";
import { GeoFilterSearchBar } from "./filterBarComponents/GeoFilterSearchBar";
import { KeywordSearchBar } from "./filterBarComponents/KeywordSearchBar";
import { CatalogListCard } from "./ListCard";
import { CatalogPaginationControls } from "./PaginationControls";
import { ViewMapSwitch } from "./ViewMapSwitch";

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
              <div className="CatalogGrid">
                {contents.results.length > 0 &&
                  contents?.results?.map((v) => (
                    <CatalogListCard collection={v} key={v.collection_id} />
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
