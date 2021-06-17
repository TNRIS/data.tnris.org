// package imports
import { List, PageHeader, Row, Skeleton, Spin, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  useRecoilValue,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";
import {
  fetchAreaTypesByCollectionIdSelector,
  fetchCollectionByIdSelector,
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
import { layersAtom, sourcesAtom } from "../MapControlPanel";
import { DownloadAreasList } from "./DownloadAreasList";
import { MetadataTab } from "./MetadataTab";

export default function CollectionTabsContainer({ collection }) {
  const history = useHistory();
  const collection_id = useQueryParam().get("c");
  const map = useRecoilValue(mapAtom);
  const setMapSources = useSetRecoilState(sourcesAtom);
  const setMapLayers = useSetRecoilState(layersAtom);
  const [activeTab, setActiveTab] = useState("0");

  const { state: collectionState, contents: collectionContents } =
    useRecoilValueLoadable(fetchCollectionByIdSelector(collection_id));

  const { state: AreaTypesState, contents: AreaTypesContents } =
    useRecoilValueLoadable(fetchAreaTypesByCollectionIdSelector(collection_id));

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
  }, [map, collectionContents]);
  // Add WMS / Preview Layers when map initialized and collectionContents retreived
  useEffect(() => {
    if (map && collectionContents) {
      console.log(collectionContents);
      if (collectionContents.wms_link) {
        setMapSources((prev) => {
          return {
            ...prev,
            "wms-preview": {
              type: "vector",
              tiles: [
                collectionContents.wms_link +
                  "&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=all&map.imagetype=mvt",
              ],
            },
          };
        });
        setMapLayers((prev) => {
          return [
            ...prev,
            {
              id: "wms-preview-layer",
              type: "raster",
              source: "wms-preview",
              layout: { visibility: "none" },
              label: "Preview",
            },
          ];
        });
      }
      /* if (collectionContents.index_service_url) {
        setMapSources((prev) => {
          return {
            ...prev,
            "wms-index": {
              type: "vector",
              tiles: [
                collectionContents.index_service_url +
                  "&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=all&map.imagetype=mvt",
              ],
            },
          };
        });
        setMapLayers((prev) => {
          return [
            ...prev,
            {
              id: "wms-index-layer",
              type: "line",
              source: "wms-index",
              "source-layer": "wms-index",
              layout: { visibility: "visible" },
              interactive: true,
              paint: {
                "line-color": "#333",
                "line-width": 1,
                "line-opacity": 1,
              },
              label: "Index",
            },
          ];
        });
      } */
    }
  }, [map, collectionContents, setMapSources, setMapLayers]);
  //remove preview layers and sources on unmounting with cleanup fn
  useEffect(() => {
    return () => {
      if (
        map &&
        map.getLayer("wms-preview-layer") &&
        map.getSource("wms-preview")
      ) {
        setMapLayers((prev) =>
          [...prev].filter((layer) => layer.id !== "wms-preview-layer")
        );
        map.removeLayer("wms-preview-layer");
        setMapSources((prev) => {
          //make a copy of prev, since it is immutable in recoil
          const newData = { ...prev };
          delete newData["wms-preview"];

          return newData;
        });
        map.removeSource("wms-preview");
      }
    };
  }, []);
  useEffect(() => {
    const scrollEl = document.getElementsByClassName(
      "ant-tabs-content-holder"
    )[0];
    if (scrollEl) {
      scrollEl.scrollTo(0, 0);
    }
  }, [activeTab]);

  // Sets the active tab in the state
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <>
      <div id="TabsContainer">
        {collectionContents && (
          <PageHeader
            title={collectionContents.name}
            extra={
              <span>
                {String(
                  new Date(collectionContents.acquisition_date).getFullYear()
                )}
              </span>
            }
            onBack={() => (history.length > 0 ? history.goBack() : null)}
          />
        )}
        <div id={"TabContentContainer"}>
          <Spin
            spinning={collectionState === "loading"}
            tip={"collection data loading..."}
          />
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
                {AreaTypesState === "loading" && (
                  <Spin
                    spinning={AreaTypesState === "loading"}
                    tip={"Loading collection resources..."}
                  >
                    <Skeleton>
                      <List>
                        <List.Item>
                          <Row></Row>
                        </List.Item>
                        <List.Item>
                          <Row></Row>
                        </List.Item>
                        <List.Item>
                          <Row></Row>
                        </List.Item>
                      </List>
                    </Skeleton>
                  </Spin>
                )}
                {AreaTypesState !== "loading" && (
                  <DownloadAreasList
                    collectionId={collectionContents.collection_id}
                    activeTab={activeTab}
                    areaTypes={AreaTypesContents}
                    areaTypesState={AreaTypesState}
                  />
                )}
              </Tabs.TabPane>
              <Tabs.TabPane
                tab="Custom Order"
                key="2"
                style={{ height: "100%" }}
              >
                {collectionState === "hasValue" && (
                  <OrderFormContainer collection={collectionContents} />
                )}
              </Tabs.TabPane>
              <Tabs.TabPane tab="Contact" key="3" style={{ height: "100%" }}>
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
    </>
  );
}
