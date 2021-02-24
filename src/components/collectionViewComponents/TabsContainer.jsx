// package imports
import { PageHeader, Skeleton, Spin, Table, Tabs } from "antd";
import { useHistory } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import {
  fetchCollectionByIdSelector,
  fetchResourcesByCollectionIdSelector
} from "../../utilities/atoms/collectionsAtoms";
// local imports
import useQueryParam from "../../utilities/custom-hooks/useQueryParam";
import { DownloadsTab } from "./DownloadsTab";
import { MetadataTab } from "./MetadataTab";


export default function CollectionTabsContainer({ collection }) {
  const history = useHistory();
  const collection_id = useQueryParam().get("c");
  const { state, contents } = useRecoilValueLoadable(
    fetchCollectionByIdSelector(collection_id)
  );
  const {
    state: resourcesState,
    contents: resourcesContents,
  } = useRecoilValueLoadable(
    fetchResourcesByCollectionIdSelector(collection_id)
  );

  return (
    <div id="TabsContainer">
      {contents && (
        <PageHeader
          title={contents.name}
          onBack={() => (history.length > 0 ? history.goBack() : null)}
        />
      )}
      <div id={"TabContentContainer"}>
        {state !== "loading" && contents && (
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
              <MetadataTab metadata={contents} />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Data Downloads" key="1">
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
