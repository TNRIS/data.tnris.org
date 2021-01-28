// package imports
import { GeolocateControl, Map, NavigationControl } from "maplibre-gl";
import "maplibre-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef, useState } from "react";
// local imports
import useQueryParam from "../../../utilities/custom-hooks/useQueryParam";

const cartodb = window.cartodb;

export function MapContainer() {
  const [map, setMap] = useState(null);
  const [lng] = useState(-99.341389);
  const [lat] = useState(31.33);
  const [zoom] = useState(5.5);
  const [bounds, setBounds] = useState(null); 
  const CatalogMapContainer = useRef(null);
  
  useEffect(() => {
    const mapTilerKey = "olPbAXB9QkZuFSDG4x2V"
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new Map({
        container: CatalogMapContainer.current,
        // style: `https://api.maptiler.com/maps/topo/style.json?key=${mapTilerKey}`,
        style: 'http://basemap.tnris.org.s3-website-us-east-1.amazonaws.com/basic.json',
        center: [lng, lat],
        zoom: zoom
      });

      map.addControl(
        new NavigationControl()
      );
      
      map.addControl(
        new GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      );

      map.on("load", () => {
        setMap(map);
      });

      map.on("moveend", () => {
        setBounds(JSON.stringify(map.getBounds()));
      });

      map.on('load', () => {
        // define area type layers and add to the map
        const areaTypeLayerData = {
          user_name: 'tnris-flood',
          sublayers: [{
            sql: `SELECT
                    the_geom_webmercator,
                    area_type,
                    area_type_name,
                    ST_AsText(ST_Centroid(the_geom)) as centroid
                  FROM
                    area_type;`,
            cartocss: '{}'
          }],
          maps_api_template: 'https://tnris-flood.carto.com'
        };
  
        cartodb.Tiles.getTiles(areaTypeLayerData, function (result, error) {
          if (result == null) {
            console.log("error: ", error.errors.join('\n'));
            return;
          }
  
          const areaTypeTiles = result.tiles.map(function (tileUrl) {
            return tileUrl
              .replace('{s}', 'a')
              .replace(/\.png/, '.mvt');
          });
  
          map.addSource(
            'area-type-source',
            { type: 'vector', tiles: areaTypeTiles }
          );
  
          // Add the county outlines to the map
          map.addLayer({
            'id': 'county-outline',
            'type': 'line',
            'source': 'area-type-source',
            'source-layer': 'layer0',
            'minzoom': 2,
            'maxzoom': 24,
            'paint': {
              'line-color': '#666',
              'line-width': 1.5,
              'line-opacity': .4
            },
            'filter': ["==", ["get", "area_type"], "county"]
          });
  
          // Add the quad outlines to the map
          map.addLayer({
            'id': 'quad-outline',
            'type': 'line',
            'source': 'area-type-source',
            'source-layer': 'layer0',
            'minzoom': 9,
            'maxzoom': 24,
            'paint': {
              'line-color': 'rgba(139,69,19,1)',
              'line-width': 1.5,
              'line-opacity': .05
            },
            'filter': ["==", ["get", "area_type"], "quad"]
          }, 'county-outline');
        });
      });
    }

    if (!map) initializeMap({ setMap, CatalogMapContainer });

  }, [map, lng, lat, zoom, bounds]);

  // We need to resize the map if it is initialized while hidden
  // because the map container size can't be determined till the
  // css loads. Setting a timeout is the best way I could do that
  // for now. There may be a better way do do this with hooks.
  const showMap = useQueryParam().get("map");
  if (map) {
    if (showMap === "true") {
      setTimeout(() => {map.resize()}, 10);
    }
  }

  return (
    <div>
        <div
          ref={el => CatalogMapContainer.current = el}
          className='CatalogMapContainer'
          style={{
            position: "absolute",
            top: "0",
            bottom: "0",
            width: "100%"
          }}
        >
        </div>
        {bounds ? 
        <div
          style={{
            display: "block",
            position: "relative",
            margin: "12px auto",
            width: "50%",
            padding: "10px",
            border: "solid 1px #666",
            borderRadius: "3px",
            fontSize: "12px",
            textAlign: "center",
            color: "#222",
            background: "#fff"
          }}
        >
          MAP BOUNDS:<br/>
          {bounds}
        </div> : ''}
    </div>
  );
}