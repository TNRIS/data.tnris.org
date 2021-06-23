import Icon from "@ant-design/icons";
import { Row } from "antd";
import { useLocation } from "react-router-dom";
import { atom, useRecoilValue } from "recoil";
import { MapLayer } from "./MapLayer";

export const LayersSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    //xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
    preserveAspectRatio="xMidYMid meet"
    viewBox="73.45544554455445 61.07920792079216 40.72277227722773 40.742574257425815"
    width="24"
    height="24.01"
    {...props}
  >
    <path
      d="M82.47 70.11L111.18 70.11L111.18 98.82L82.47 98.82L82.47 70.11Z"
      id="a1XNPlRvKb"
    />
    <path
      d="M78.48 66.1L107.19 66.1L107.19 94.81L78.48 94.81L78.48 66.1Z"
      id="iL7YJ25pt"
    />
    <path
      d="M74.46 62.08L103.17 62.08L103.17 90.79L74.46 90.79L74.46 62.08Z"
      id="b1KB8e6pIu"
    />
  </svg>
);

export const LayersIcon = (props) => (
  <Icon {...props}>
    <LayersSVG style={props.svgStyle} />
  </Icon>
);
export const sourcesAtom = atom({
  key: "sourcesAtom",
  default: {
    "satellite-basemap": {
      type: "raster",
      tiles: [
        "https://imagery.tnris.org/server/services/NAIP/NAIP18_NCCIR_60cm/ImageServer/WMSServer?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&transparent=true&width=256&height=256&layers=0",
      ],
      tileSize: 256,
    },
  },
});
export const layersAtom = atom({
  key: "layersAtom",
  default: [],
});
export function MapControlPanel() {
  const layers = useRecoilValue(layersAtom);
  const sources = useRecoilValue(sourcesAtom);
  const location = useLocation();

  return (
    <>
      <Row justify="start" gutter={[0, 16]} id="MapLayerControls">
        <MapLayer
          key={"satellite-basemap-layer_1"}
          sourceId={"satellite-basemap"}
          source={sources["satellite-basemap"]}
          layer={{
            id: "satellite-basemap-layer",
            type: "raster",
            source: "satellite-basemap",
            label: "Satellite",
          }}
          label={"Satellite"}
          defaultVisibility={false}
        />
        {location.pathname === "/collection" &&
          layers &&
          layers.length > 0 &&
          layers.map((layer, idx) => (
            <MapLayer
              key={layer.id + "_" + idx}
              sourceId={layer.source}
              source={sources[layer.source]}
              layer={layer}
              label={layer.label}
              defaultVisibility={false}
            />
          ))}
      </Row>
    </>
  );
}
