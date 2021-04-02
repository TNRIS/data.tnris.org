// package imports
import { PageHeader, Skeleton, Spin, Table, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import {
  fetchCollectionByIdSelector,
  fetchResourcesByCollectionIdSelector,
  fetchAreaTypesByCollectionIdSelector,
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

const { TabPane } = Tabs;

export default function CollectionTabsContainer({ collection }) {
  const history = useHistory();
  const collection_id = useQueryParam().get("c");
  const map = useRecoilValue(mapAtom);

  const [activeTab, setActiveTab] = useState("0");
  
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

  const {
    state: AreaTypesState,
    contents: AreaTypesContents,
  } = useRecoilValueLoadable(
    fetchAreaTypesByCollectionIdSelector(collection_id)
  );

  useEffect(() => {
    console.log(collectionState)
    console.log(AreaTypesContents)
    // if (AreaTypesContents) {
    //   console.log(AreaTypesContents)
    // }
    console.log(resourcesContents)
    if(map && collectionContents.the_geom){
      highlightCoverage(map, collectionContents.the_geom);
      zoomToFeatures(map, collectionContents.the_geom);
    }

    return () => {
      if (map && map.getLayer("collection-coverage-layer")) {
        removeHighlightCoverage();
        return null
      }
      return null
    };
  }, [
    map,
    AreaTypesContents,
    collectionState,
    collectionContents,
    resourcesContents
  ]);

  // Sets
  const handleTabChange = (key) => {
    setActiveTab(key);
  }

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
            activeKey={activeTab}
            onChange={handleTabChange}
            tabPosition={"top"}
            animated={true}
            style={{
              display: "grid",
              gridTemplateColumns: "100%",
              gridTemplateRows: "auto 1fr",
            }}
            keyboard="true"
          >
            <TabPane tab="Metadata" key="0" style={{ height: "100%" }}>
              <MetadataTab metadata={collectionContents} />
            </TabPane>
            <TabPane tab="Downloads" key="1">
              <Spin
                spinning={resourcesState === "loading"}
                tip="Large collection, please wait as resources load..."
              >
                {resourcesState !== "loading" ? (
                  <DownloadsTab
                    activeTab={activeTab}
                    areaTypes={AreaTypesContents}
                    areaTypesState={AreaTypesState}
                    resources={resourcesContents}
                    resourcesState={resourcesState}
                  />
                ) : (
                  <Skeleton>
                    <Table />
                  </Skeleton>
                )}
              </Spin>
            </TabPane>
            <TabPane tab="WMS Link" key="2" style={{ height: "100%" }}>
              WMS Link
            </TabPane>
            <TabPane tab="Custom Order" key="3" style={{ height: "100%" }}>
              Custom Order
            </TabPane>
            <TabPane tab="Contact" key="4" style={{ height: "100%" }}>
              Custom Order
            </TabPane>
          </Tabs>
        )}
      </div>
    </div>
  );
}
