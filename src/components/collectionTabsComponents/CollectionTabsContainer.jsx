// package imports
import { PageHeader, Spin, Tabs } from "antd";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import {
  fetchCollectionByIdSelector,
  fetchResourcesByCollectionIdSelector,
} from "../../utilities/atoms/collectionsAtoms";

// local imports
import useQueryParam from "../../utilities/custom-hooks/useQueryParam";
import { ResourcesDownloadsTab } from "./ResourcesDownloadTab";

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

  useEffect(() => {
    console.log(resourcesContents);
  }, [resourcesContents]);

  return (
    <div style={{ height: "100%", padding: "8px", paddingBottom: "40px" }}>
      <Spin
        spinning={state === "loading"}
        tip="one moment, loading collection data"
      >
        {contents && (
          <PageHeader
            title={contents.name}
            onBack={() => (history.length > 0 ? history.goBack() : null)}
          />
        )}
        {state !== "loading" && contents && (
          <Tabs tabPosition={"left"} type="card">
            <Tabs.TabPane tab="Metadata" key="0">
              {contents &&
                Object.entries(contents).map((v, i) => (
                  <div
                    key={contents.collection_id + "_" + v[0]}
                    style={
                      i === Object.keys(contents).length - 1
                        ? { paddingBottom: "40px" }
                        : null
                    }
                  >
                    <h3
                      style={{ fontVariant: "small-caps", fontWeight: "800" }}
                    >
                      {v[1] ? v[0].replaceAll("_", " ") : null}
                    </h3>
                    <p>{v[1] ? v[1] : null}</p>
                  </div>
                ))}
            </Tabs.TabPane>
            <Tabs.TabPane tab="Data Downloads" key="1">
              <Spin
                spinning={resourcesState === "loading"}
                tip={"Very large dataset, please wait while resources load."}
              >
                {resourcesState !== "loading" && (
                  <ResourcesDownloadsTab resources={resourcesContents} />
                )}
              </Spin>
            </Tabs.TabPane>
            <Tabs.TabPane tab="WMS Link" key="2">
              WMS Link
            </Tabs.TabPane>
          </Tabs>
        )}
      </Spin>
    </div>
  );
}
