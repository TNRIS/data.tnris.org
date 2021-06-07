import { CloseOutlined, DownloadOutlined } from "@ant-design/icons";
import { Button, Card, Col, Empty, List, Row, Skeleton, Spin } from "antd";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import {
  collectionAreasMapSelectionAtom,
  fetchResourcesByCollectionIdAndAreaTypeIDSelector,
} from "../../utilities/atoms/collectionsAtoms";

export function DownloadAreaResources({ areaTypeId, collectionId, hovered }) {
  const setSelectedAreas = useSetRecoilState(collectionAreasMapSelectionAtom);
  const { state: resourcesState, contents: resourcesContents } =
    useRecoilValueLoadable(
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
      {resourcesState === "hasValue" &&
        resourcesContents.results &&
        resourcesContents.results.length === 0 && (
          <Empty description="There aren't any resources to download for this area in this collection." />
        )}
      {resourcesState === "hasValue" &&
        resourcesContents.results &&
        resourcesContents.results.length > 0 && (
          <Card
            bordered
            size="small"
            style={{ border: hovered ? "solid black 1px" : "inherit" }}
          >
            <Row
              justify="space-between"
              align="middle"
              style={{
                background: "#73808c40",
                padding: ".125rem .25rem",
              }}
            >
              <Col>
                <strong>
                  {resourcesContents.results[0].area_type_name +
                    " " +
                    resourcesContents.results[0].area_type}
                </strong>
              </Col>
              <Col>
                <Button
                  onClick={() =>
                    setSelectedAreas((current) =>
                      current.filter(
                        (v) => v !== resourcesContents.results[0].area_type_id
                      )
                    )
                  }
                  type="outlined"
                  icon={<CloseOutlined />}
                  style={{ marginLeft: "1rem" }}
                />
              </Col>
            </Row>
            {[...resourcesContents.results]
              .sort((a, b) =>
                a.resource_type_name > b.resource_type_name ? 1 : -1
              )
              .map((v, i) => (
                <Row key={v.resource_id} align="middle" justify="space-between">
                  <Col>{v.resource_type_name}</Col>
                  <Col>
                    <Button
                      icon={<DownloadOutlined />}
                      type={"link"}
                      href={v.resource}
                    >
                      Download{" "}
                      {`(~${(v.filesize / 1000000).toFixed(2).toString()}mb)`}
                    </Button>
                  </Col>
                </Row>
              ))}
          </Card>
        )}
    </>
  );
}
