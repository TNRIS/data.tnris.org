import { Col, Empty, Input, message, PageHeader, Spin } from "antd";
import { useEffect, useState } from "react";
import { useRecoilValueLoadable } from "recoil";
import { fetchCatalogCollectionsSelector } from "../../atoms/catalogAtoms";
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

  //if results returned, notify how many with toast
  useEffect(() => {
    if(state === "loading") {
      message.loading({
        content: `Searching for collections...`,
        key: "catalogCount",
        style: { position: "fixed", bottom: "2.4rem", },
      })
    }
    if (state === "hasValue") {
      message.success({
        content: `${contents.count} collections found`,
        key: "catalogCount",
        style: { position: "fixed", bottom: "2.4rem", },
      });
    }
  }, [state, contents]);

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
          style={{ paddingTop: "124px" }}
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
