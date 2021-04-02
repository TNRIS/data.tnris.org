// package imports
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
//import { AREA_TYPES } from "../utilities/constants/areaTypes";
import useQueryParam from "../utilities/custom-hooks/useQueryParam";

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
        // style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
        // style: 'http://basemap.tnris.org.s3-website-us-east-1.amazonaws.com/basic.json',
        // style: "http://basemap.tnris.org.s3-website-us-east-1.amazonaws.com/liberty.json"
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
      map.on("moveend", () => {
        setBounds(JSON.stringify(map.getBounds()));
      });
      map.on("load", () => {
        // store map object in Recoil Atom
        setMap(map);
        //retreive area type tiles as mvt
        /* const areaTypeTiles =
          "https://mapserver.tnris.org/?map=/tnris_mapfiles/area_type.map&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=area_type&map.imagetype=mvt";
        // add source for area-type layers
        map.addSource("area-type-source", {
          type: "vector",
          tiles: [areaTypeTiles],
        }); */

        /* AREA_TYPES.forEach((v, i) => {
          map.addLayer(
            {
              id: `${v}-outline`,
              type: "line",
              source: "area-type-source",
              "source-layer": "area_type",
              minzoom: 2,
              maxzoom: 24,
              paint: {
                "line-color": "#222",
                "line-width": 1.0,
                "line-opacity": 0.75,
              },
              layout: { visibility: "none" },
              filter: ["in", "area_type", v],
            },
            AREA_TYPES[i - 1] ? `${AREA_TYPES[i - 1]}-outline` : null
          );
        }); */
      });
    };

    if (!map) {
      initializeMap({ setMap, MapContainer });
    }
  }, [map, bounds, setBounds, zoom, setMap]);

  // show geofilter search geometry when available
  useEffect(() => {
    // only animate to geosearch layer when at root "/" path
    // check that map is initialized
    if (map) {
      // check if layer already exists
      const filterLayer = map.getLayer("geofilter-layer");
      if (typeof filterLayer !== "undefined") {
        // if it exists, remove it and its source
        map.removeLayer("geofilter-layer");
        map.removeSource("geofilter-source");
      }
      // check if geoFilterSelection atom is populated with search result
      if (geoFilterSelection) {
        // if so, add source from geojson and layer from source
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
        // after adding layer, fit bounds to selection
        //map.fitBounds(geoFilterSelection.bbox, { padding: 100 });
      }
    }
  }, [geoFilterSelection, map, location]);

  // We need to resize the map if it is initialized while hidden
  // because the map container size can't be determined till the
  // css loads. Setting a timeout is the best way I could do that
  // for now. There may be a better way do do this with hooks.
  const showMap = useQueryParam().get("map");
  if (map) {
    if (showMap === "true") {
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
