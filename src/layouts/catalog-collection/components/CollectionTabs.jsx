// package imports
import { Spin } from "antd";
import { useRecoilValueLoadable } from "recoil";
import {
  fetchAreasByCollectionIdSelector,
  fetchCollectionByIdSelector,
  fetchResourcesByCollectionIdSelector,
} from "../../../utilities/atoms/collectionsAtoms";

// local imports
import useQueryParam from "../../../utilities/custom-hooks/useQueryParam";

export default function CollectionTabs() {
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
  const {
    state: areasState,
    contents: areasContents,
  } = useRecoilValueLoadable(
    fetchAreasByCollectionIdSelector(collection_id)
  );
  resourcesContents && resourcesState !== "loading" && console.log('resources', resourcesContents) 
  areasContents && areasState !== "loading" && console.log('areas', areasContents) 

  return (
    <div style={{ height: "100%", padding: "8px", paddingBottom: "40px" }}>
      <Spin
        spinning={state === "loading"}
        tip="one moment, loading collection data"
      >
        {contents && <h2>{contents.name}</h2>}
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
              <h3 style={{ fontVariant: "small-caps", fontWeight: "800" }}>
                {v[1] ? v[0].replaceAll("_", " ") : null}
              </h3>
              <p>{v[1] ? v[1] : null}</p>
            </div>
          ))}
      </Spin>
    </div>
  );
}
