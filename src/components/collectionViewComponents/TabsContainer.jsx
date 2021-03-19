// package imports
import { PageHeader, Skeleton, Spin, Table, Tabs } from "antd";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import {
  fetchCollectionByIdSelector,
  fetchResourcesByCollectionIdSelector,
} from "../../utilities/atoms/collectionsAtoms";
import { mapAtom } from "../../utilities/atoms/mapAtoms";
// local imports
import useQueryParam from "../../utilities/custom-hooks/useQueryParam";
import {
  highlightCoverage,
  removeHighlightCoverage,
} from "../../utilities/mapHelpers/highlightHelpers";
import { zoomToFeatures } from "../../utilities/mapHelpers/zoomHelpers";
import { DownloadsTab } from "./DownloadsTab";
import { MetadataTab } from "./MetadataTab";

export default function CollectionTabsContainer({ collection }) {
  const history = useHistory();
  const collection_id = useQueryParam().get("c");
  const map = useRecoilValue(mapAtom);
  const {
    state: collectionState,
    contents: collectionContents,
  } = useRecoilValueLoadable(fetchCollectionByIdSelector(collection_id));
  const {
    state: resourcesState,
    contents: resourcesContents,
  } = useRecoilValueLoadable(
    fetchResourcesByCollectionIdSelector(collection_id)
  );
  useEffect(() => {
    console.log(collectionContents)
    if(map && collectionContents.the_geom){
      highlightCoverage(map, collectionContents.the_geom);
      zoomToFeatures(map, collectionContents.the_geom);
    }

    return () => {
      if (map && map.getLayer("collection-coverage-layer")) {
        removeHighlightCoverage(map);
        return null
      }
      return null
    };
  }, [map, collectionContents]);

  return (
    <div id="TabsContainer">
      {collectionContents && (
        <PageHeader
          title={collectionContents.name}
          onBack={() => (history.length > 0 ? history.goBack() : null)}
        />
      )}
      <div id={"TabContentContainer"}>
        {collectionState !== "loading" && collectionContents && (
          <Tabs
            tabPosition={"top"}
            style={{
              display: "grid",
              gridTemplateColumns: "100%",
              gridTemplateRows: "auto 1fr",
            }}
            keyboard="true"
          >
            <Tabs.TabPane tab="Metadata" key="0" style={{ height: "100%" }}>
              <MetadataTab metadata={collectionContents} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Downloads" key="1">
              <Spin
                spinning={resourcesState === "loading"}
                tip="Large collection, please wait as resources load..."
              >
                {resourcesState !== "loading" ? (
                  <DownloadsTab
                    resources={resourcesContents}
                    resourcesState={resourcesState}
                  />
                ) : (
                  <Skeleton>
                    <Table />
                  </Skeleton>
                )}
              </Spin>
            </Tabs.TabPane>
            <Tabs.TabPane tab="WMS Link" key="2" style={{ height: "100%" }}>
              WMS Link
            </Tabs.TabPane>
            <Tabs.TabPane tab="Custom Order" key="3" style={{ height: "100%" }}>
              Custom Order
            </Tabs.TabPane>
            <Tabs.TabPane tab="Contact" key="4" style={{ height: "100%" }}>
              Custom Order
            </Tabs.TabPane>
          </Tabs>
        )}
      </div>
    </div>
  );
}
