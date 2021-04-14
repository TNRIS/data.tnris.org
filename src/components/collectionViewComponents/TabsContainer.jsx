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
  addCoverageLayer,
  removeCoverageLayer,
} from "../../utilities/mapHelpers/highlightHelpers";
import { zoomToFeatures } from "../../utilities/mapHelpers/zoomHelpers";
import { DataInquiryForm } from "../forms/DataInquiryForm";
import { OrderFormContainer } from "../forms/orderForms/OrderFormContainer";
import { DownloadsTab } from "./DownloadsTab";
import { MetadataTab } from "./MetadataTab";


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
    if (map && collectionContents.the_geom) {
      addCoverageLayer(map, collectionContents.the_geom);
      zoomToFeatures(map, collectionContents.the_geom);
    }

    return () => {
      if (map && map.getLayer("collection-coverage-layer")) {
        removeCoverageLayer(map);
        return null;
      }
      return null;
    };
  }, [
    map,
    collectionContents
  ]);

  // Sets the active tab in the state
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
            type="card"
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
            </Tabs.TabPane>
            <Tabs.TabPane tab="Service Links" key="2" style={{ height: "100%" }}>
              WMS Link
            </Tabs.TabPane>
            <Tabs.TabPane tab="Custom Order" key="3" style={{ height: "100%" }}>
              {collectionState === "hasValue" && (
                <OrderFormContainer collection={collectionContents} />
              )}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Contact" key="4" style={{ height: "100%" }}>
              {collectionState === "hasValue" && (
                <DataInquiryForm
                  collectionId={collectionContents.collection_id}
                  collectionName={collectionContents.name}
                  collectionCategory={collectionContents.category}
                  collectionAcquisitionDate={
                    collectionContents.acquisition_date
                  }
                />
              )}
            </Tabs.TabPane>
          </Tabs>
        )}
      </div>
    </div>
  );
}
