// Package imports
import { GeolocateControl, Map, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  geoFilterSelectedResult,
  mapBounds,
} from "../utilities/atoms/geofilterAtoms";
import { mapAtom } from "../utilities/atoms/mapAtoms";
import useQueryParam from "../utilities/custom-hooks/useQueryParam";
import {
  NavigateToExtentControl
} from "../utilities/mapHelpers/navigateToExtentControl.js";

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
        // you can switch to one the commented out basemaps below if the other
        // one is causing trouble
        // style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
        // style: "http://basemap.tnris.org.s3-website-us-east-1.amazonaws.com/basic.json",
        // style: "http://basemap.tnris.org.s3-website-us-east-1.amazonaws.com/liberty.json",
        style:
          "http://basemap.tnris.org.s3-website-us-east-1.amazonaws.com/liberty.json",
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
      map.addControl(navigateToExtentControl, 'top-left');

      map.on("moveend", () => {
        setBounds(JSON.stringify(map.getBounds()));
      });
      map.on("load", () => {
        // Store map object in Recoil Atom
        setMap(map);
      });
    }

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
      <div
        ref={(el) => (MapContainer.current = el)}
        className="MapContainer"
        style={{
          position: "absolute",
          top: "0",
          bottom: "0",
          width: "100%",
          height: "100%",
        }}
      ></div>
    </>
  );
}
