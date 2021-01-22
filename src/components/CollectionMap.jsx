// package imports
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Map, NavigationControl, GeolocateControl } from 'maplibre-gl';
import 'maplibre-gl/dist/mapbox-gl.css';

// local imports
import useQuery from "../utilities/custom-hooks/useQuery";

export function CollectionMap() {
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(-99.341389);
  const [lat, setLat] = useState(31.33);
  const [zoom, setZoom] = useState(5.4);
  const CollectionMapContainer = useRef(null);
  
  useEffect(() => {
    const mapTilerKey = "olPbAXB9QkZuFSDG4x2V"
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new Map({
        container: CollectionMapContainer.current,
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

    if (!map) initializeMap({ setMap, CollectionMapContainer });

  }, [map, lng, lat, zoom]);

  return (
    <div>
        <div
          ref={el => CollectionMapContainer.current = el}
          className='CollectionMapContainer'
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
