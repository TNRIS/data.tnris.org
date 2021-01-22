// package imports
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Map, NavigationControl, GeolocateControl } from 'maplibre-gl';
import 'maplibre-gl/dist/mapbox-gl.css';

// local imports
import useQuery from "../utilities/custom-hooks/useQuery";

export function CatalogMap() {
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(-99.341389);
  const [lat, setLat] = useState(31.33);
  const [zoom, setZoom] = useState(5.4);
  const CatalogMapContainer = useRef(null);
  
  useEffect(() => {
    const mapTilerKey = "olPbAXB9QkZuFSDG4x2V"
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new Map({
        container: CatalogMapContainer.current,
        style: `https://api.maptiler.com/maps/topo/style.json?key=${mapTilerKey}`,
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
    }

    if (!map) initializeMap({ setMap, CatalogMapContainer });

  }, [map, lng, lat, zoom]);

  // We need to resize the map if it is initialized while hidden
  // because the map container size can't be determined till the
  // css loads. Setting a timeout is the best way I could do that
  // for now. There may be a better way do do this with hooks.
  const showMap = useQuery().get("map");
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
        />
    </div>
  );
}
