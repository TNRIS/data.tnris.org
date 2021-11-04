// Package imports
import { GeolocateControl, Map, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { mapBoundsAtom } from "../atoms/geofilterAtoms";
import { mapAtom } from "../atoms/mapAtoms";
import useQueryParam from "../utilities/customHooks/useQueryParam";
import { NavigateToExtentControl } from "../utilities/mapHelpers/navigateToExtentControl.js";
import { MapControlPanel } from "./MapControlPanel";

export function MapContainer() {
  const [map, setMap] = useRecoilState(mapAtom);
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

      map.on("load", () => {
        map.loadImage(
          "https://maplibre.org/maplibre-gl-js-docs/assets/custom_marker.png",
          // Add an image to use as a custom marker
          function (error, image) {
            if (error) throw error;
            map.addImage("custom-marker", image);
          }
        );
        // Store map object in Recoil Atom
        setMap(map);
      });
    };

    if (!map) {
      initializeMap({ setMap, MapContainer });
    }
  }, [map, bounds, setBounds, zoom, setMap]);

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
