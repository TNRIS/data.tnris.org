// package imports
import { GeolocateControl, Map, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  geoFilterSelectedResult,
  hoverPreviewCoverageCounties,
} from "../utilities/atoms/geofilterAtoms";
// local imports
import useQueryParam from "../utilities/custom-hooks/useQueryParam";

const cartodb = window.cartodb;

export function MapContainer() {
  const geoFilterSelection = useRecoilValue(geoFilterSelectedResult);
  const highlightedCounties = useRecoilValue(hoverPreviewCoverageCounties);
  const [map, setMap] = useState(null);
  const [lng] = useState(-99.341389);
  const [lat] = useState(31.33);
  const [zoom] = useState(5.5);
  const [bounds, setBounds] = useState(null);
  const CatalogMapContainer = useRef(null);

  useEffect(() => {
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new Map({
        container: CatalogMapContainer.current,
        // you can switch to one the commented out basemaps below if the other
        // one is causing trouble
        // style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
        // style: 'http://basemap.tnris.org.s3-website-us-east-1.amazonaws.com/basic.json',
        style:
          "http://basemap.tnris.org.s3-website-us-east-1.amazonaws.com/liberty.json",
        center: [lng, lat],
        zoom: zoom,
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

      map.on("load", () => {
        setMap(map);
      });

      map.on("moveend", () => {
        setBounds(JSON.stringify(map.getBounds()));
      });

      map.on("load", () => {
        const areaTypeLayerData = {
          user_name: "tnris-flood",
          sublayers: [
            {
              sql: `SELECT
                    the_geom_webmercator,
                    area_type,
                    area_type_name,
                    ST_AsText(ST_Centroid(the_geom)) as centroid
                  FROM
                    area_type;`,
              cartocss: "{}",
            },
          ],
          maps_api_template: "https://tnris-flood.carto.com",
        };

        cartodb.Tiles.getTiles(areaTypeLayerData, function (result, error) {
          if (result == null) {
            console.log("error: ", error.errors.join("\n"));
            return;
          }

          const areaTypeTiles = result.tiles.map(function (tileUrl) {
            return tileUrl.replace("{s}", "a").replace(/\.png/, ".mvt");
          });

          map.addSource("area-type-source", {
            type: "vector",
            tiles: areaTypeTiles,
          });

          // Add the county outlines to the map
          map.addLayer(
            {
              id: "county-outline",
              type: "line",
              source: "area-type-source",
              "source-layer": "layer0",
              minzoom: 2,
              maxzoom: 24,
              paint: {
                "line-color": "#666",
                "line-width": 1.5,
                "line-opacity": 0.4,
              },
              filter: ["in", "area_type", "county"],
            }
            // Place these under the area-type-selected layer
          );

          // Add the quad outlines to the map
          map.addLayer(
            {
              id: "quad-outline",
              type: "line",
              source: "area-type-source",
              "source-layer": "layer0",
              minzoom: 9,
              maxzoom: 24,
              paint: {
                "line-color": "rgba(139,69,19,1)",
                "line-width": 1.5,
                "line-opacity": 0.05,
              },
              filter: ["in", "area_type", "quad"],
            },
            // Place these under the county-outline layer
            "county-outline"
          );
        });
      });
    };

    if (!map) initializeMap({ setMap, CatalogMapContainer });
  }, [map, lng, lat, zoom, bounds]);

  // add highlighted counties when set / changed
  useEffect(() => {
    // if highlighted counties array length is 0, remove layers from map
    if (map && highlightedCounties.length === 0) {
      const mapLayer = map.getLayer("area-type-selected");
      // check that the map layer exists before attempting to remove it
      // this is required onload when highlightedCounties.length will resolve to 0 as its default is []
      if (typeof mapLayer !== "undefined") {
        map.removeLayer("area-type-selected");
      }
    }
    // check if highlightedCounties length is greater or equal to 1
    if (map && highlightedCounties.length >= 1) {
      // if so, check if a layer is already drawn
      const mapLayer = map.getLayer("area-type-selected");
      if (typeof mapLayer !== "undefined") {
        // remove the previous layer if already drawn
        map.removeLayer("area-type-selected");
      }
      // add new highlightedCounties layer
      map.addLayer(
        {
          id: "area-type-selected",
          type: "fill",
          source: "area-type-source",
          "source-layer": "layer0",
          minzoom: 2,
          maxzoom: 24,
          paint: {
            "fill-color": "#1e8dc1",
            "fill-opacity": 0.4,
          },
          filter: [
            "all",
            ["==", "area_type", "county"],
            ["in", "area_type_name", ...highlightedCounties],
          ],
        },
        geoFilterSelection ? "geofilter-layer" : null
      );
    }
  }, [map, highlightedCounties, geoFilterSelection]);

  // show geofilter search geometry when available
  useEffect(() => {
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
        map.fitBounds(geoFilterSelection.bbox, { padding: 40 });
      }
    }
  }, [geoFilterSelection, map]);

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
    <div>
      <div
        ref={(el) => (CatalogMapContainer.current = el)}
        className="CatalogMapContainer"
        style={{
          position: "absolute",
          top: "0",
          bottom: "0",
          width: "100%",
        }}
      ></div>
    </div>
  );
}
