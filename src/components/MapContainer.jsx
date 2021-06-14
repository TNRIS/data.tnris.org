// Package imports
import Icon from "@ant-design/icons";
import { Menu, Switch } from "antd";
import { GeolocateControl, Map, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  geoFilterSelectedResult,
  mapBounds,
} from "../utilities/atoms/geofilterAtoms";
import { mapAtom } from "../utilities/atoms/mapAtoms";
import useQueryParam from "../utilities/custom-hooks/useQueryParam";
import { NavigateToExtentControl } from "../utilities/mapHelpers/navigateToExtentControl.js";

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
export function MapContainer() {
  const location = useLocation();
  const geoFilterSelection = useRecoilValue(geoFilterSelectedResult);
  const [map, setMap] = useRecoilState(mapAtom);
  const [bounds, setBounds] = useRecoilState(mapBounds);
  const [zoom] = useState(5.5);
  const MapContainer = useRef(null);

  useEffect(() => {
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new Map({
        container: MapContainer.current,
        style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
        center: [bounds.lng, bounds.lat],
        zoom: zoom,
        hash: true,
      });
      map.addControl(new NavigationControl());
      map.addControl(
        new GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );
      // Instantiate custom navigation control and add it to the map
      const navigateToExtentControl = new NavigateToExtentControl(map);
      map.addControl(navigateToExtentControl, "top-right");
      map.on("moveend", () => {
        setBounds(JSON.stringify(map.getBounds()));
      });
      map.on("load", () => {
        // Store map object in Recoil Atom
        setMap(map);
      });
    };

    if (!map) {
      initializeMap({ setMap, MapContainer });
    }
  }, [map, bounds, setBounds, zoom, setMap]);

  // Show geofilter search geometry when available
  useEffect(() => {
    // Only animate to geosearch layer when at root "/" path
    // Check that map is initialized
    if (map) {
      // Check if layer already exists
      const filterLayer = map.getLayer("geofilter-layer");
      if (typeof filterLayer !== "undefined") {
        // If it exists, remove it and its source
        map.removeLayer("geofilter-layer");
        map.removeSource("geofilter-source");
      }
      // Check if geoFilterSelection atom is populated with search result
      if (geoFilterSelection) {
        // If so, add source from geojson and layer from source
        map.addSource("geofilter-source", {
          type: "geojson",
          data: geoFilterSelection,
        });
        map.addLayer({
          id: "geofilter-layer",
          type: "line",
          source: "geofilter-source",
          layout: {},
          paint: {
            "line-color": "red",
            "line-opacity": 1,
            "line-width": 4,
          },
        });
        // After adding layer, fit bounds to selection
        // map.fitBounds(geoFilterSelection.bbox, { padding: 100 });
      }
    }
  }, [geoFilterSelection, map, location]);

  // We need to resize the map if it is initialized while hidden
  // because the map container size can't be determined till the
  // css loads. Setting a timeout is the best way I could do that
  // for now. There may be a better way do do this with hooks.
  // const showMap = useQueryParam().get("map");
  const showMap = useQueryParam().get("map");
  const collectionView = useQueryParam().get("c");
  if (map) {
    if (showMap === "true" || collectionView) {
      setTimeout(() => {
        map.resize();
      }, 10);
    }
  }

  return (
    <>
      <Menu mode="horizontal" selectable={false}>
        <Menu.SubMenu
          key="1"
          icon={
            <LayersIcon
              style={{ fontSize: "1.5rem" }}
              svgStyle={{
                stroke: "#1e8dc1",
                fill: "none",
                strokeWidth: "2px",
              }}
            />
          }
          title="LAYERS"
        >
          <Menu.Item
            focusable={false}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Satellite{" "}
            <Switch
              checkedChildren="ON"
              unCheckedChildren="OFF"
              checked="true"
            />
          </Menu.Item>
          <Menu.Item
            focusable={false}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Index{" "}
            <Switch
              checkedChildren="ON"
              unCheckedChildren="OFF"
              checked="true"
            />
          </Menu.Item>
          <Menu.Item
            focusable={false}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            Preview{" "}
            <Switch
              checkedChildren="ON"
              unCheckedChildren="OFF"
              checked="true"
            />
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
      <div
        ref={(el) => (MapContainer.current = el)}
        className=""
        style={{
          position: "relative",
          top: "0",
          bottom: "0",
          width: "100%",
          height: "100%",
        }}
      ></div>
    </>
  );
}
