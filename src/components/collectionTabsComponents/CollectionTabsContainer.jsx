// package imports
import { PageHeader, Spin, Tabs } from "antd";
import { useHistory } from "react-router-dom";
import { useRecoilValueLoadable } from "recoil";
import {
  fetchCollectionByIdSelector,
  fetchResourcesByCollectionIdSelector,
} from "../../utilities/atoms/collectionsAtoms";

// local imports
import useQueryParam from "../../utilities/custom-hooks/useQueryParam";

export function ResourcesDownloadsTab({resources}) {
  console.log(resources)

  return (
    <Tabs>
      <Tabs.TabPane tab="County" key="0">

      </Tabs.TabPane>
      <Tabs.TabPane tab="Quad" key="1">

      </Tabs.TabPane>
      <Tabs.TabPane tab="QQuad" key="2">

      </Tabs.TabPane>
    </Tabs>
  )
}

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

  resourcesContents &&
    resourcesState !== "loading" &&
    console.log("resources", resourcesContents);

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
        {contents && (
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
              Downloads tab
              <ResourcesDownloadsTab resources={resourcesContents} />
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

