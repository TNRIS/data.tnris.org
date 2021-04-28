import { DeleteRowOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, List, Skeleton, Spin } from "antd";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import {
  collectionAreasMapSelectionAtom,
  fetchResourcesByCollectionIdAndAreaTypeIDSelector,
} from "../../utilities/atoms/collectionsAtoms";

export function DownloadAreaResources({ areaTypeId, collectionId }) {
  const setSelectedAreas = useSetRecoilState(collectionAreasMapSelectionAtom);
  const {
    state: resourcesState,
    contents: resourcesContents,
  } = useRecoilValueLoadable(
    fetchResourcesByCollectionIdAndAreaTypeIDSelector({
      collectionId: collectionId,
      areaTypeId: areaTypeId,
    })
  );

  return (
    <>
      {resourcesState === "loading" && (
        <Spin
          spinning={resourcesState === "loading"}
          tip="Loading area resources"
        >
          <Skeleton>
            <List size="small">
              <List.Item key={1}>
                <List.Item.Meta title={"test item 1"} />
              </List.Item>
              <List.Item key={2}>
                <List.Item.Meta title={"test item 2"} />
              </List.Item>
            </List>
          </Skeleton>
        </Spin>
      )}
      {resourcesState === "hasValue" && (
        <List.Item
          extra={
            <Button
              onClick={() =>
                setSelectedAreas((current) =>
                  current.filter(
                    (v) => v !== resourcesContents.results[0].area_type_id
                  )
                )
              }
              type="outlined"
              icon={<DeleteRowOutlined />}
              shape="circle"
              style={{ marginLeft: "1rem" }}
            />
          }
        >
          <List.Item.Meta
            title={
              <strong>
                {resourcesContents.results[0].area_type_name +
                  " " +
                  resourcesContents.results[0].area_type}
              </strong>
            }
            description={
              <List size="small" bordered>
                {resourcesContents.results.map((v, i) => (
                  <List.Item
                    key={v.resource_id}
                    extra={
                      <Button
                        icon={<DownloadOutlined />}
                        type={"link"}
                        href={v.resource}
                      >
                        Download
                      </Button>
                    }
                  >
                    <List.Item.Meta title={v.resource_type_name} />
                  </List.Item>
                ))}
              </List>
            }
          />
        </List.Item>
      )}
    </>
  );
}
