// Package imports
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import bboxPolygon from "@turf/bbox-polygon";
import DrawRectangle from "mapbox-gl-draw-rectangle-mode";
import { GeolocateControl, Map, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  geoSearchBboxAtom,
  mapBoundsAtom,
} from "../atoms/geofilterAtoms";
import { drawControlsAtom, mapAtom } from "../atoms/mapAtoms";
import useQueryParam from "../utilities/customHooks/useQueryParam";
import { NavigateToExtentControl } from "../utilities/mapHelpers/navigateToExtentControl.js";
import { MapControlPanel } from "./MapControlPanel";

export function MapContainer() {
  const location = useLocation();
  const geoSearchBbox = useRecoilValue(geoSearchBboxAtom);
  const [map, setMap] = useRecoilState(mapAtom);
  const setDrawControls = useSetRecoilState(drawControlsAtom);
  const [bounds, setBounds] = useRecoilState(mapBoundsAtom);
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

      const modes = MapboxDraw.modes;
      modes.draw_rectangle = DrawRectangle;

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        modes: modes,
        controls: {
          simple_select: false,
          draw_rectangle: false,
          trash: false,
        },
      });
      map.addControl(draw);
      setDrawControls(draw);

      map.on("moveend", () => {
        //setBounds(JSON.stringify(map.getBounds()));
      });
      map.on("load", () => {
        // Store map object in Recoil Atom
        setMap(map);
      });
    };

    if (!map) {
      initializeMap({ setMap, MapContainer });
    }
  }, [map, bounds, setBounds, zoom, setMap, setDrawControls]);

  // Show  geoSearchBbox geometry when available
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
      // Check if geoSearchBbox atom is populated with search result
      if (geoSearchBbox) {
        // If so, add source from geojson and layer from source
        map.addSource("geofilter-source", {
          type: "geojson",
          data: bboxPolygon(geoSearchBbox.split(",")),
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
      }
    }
  }, [geoSearchBbox, map, location]);

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
      <MapControlPanel />
      <div
        ref={(el) => (MapContainer.current = el)}
        id="mapContainer"
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
