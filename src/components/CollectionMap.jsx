// package imports
import React, { useEffect, useRef, useState } from "react";
import { Map, NavigationControl, GeolocateControl } from 'maplibre-gl';
import 'maplibre-gl/dist/mapbox-gl.css';

export function CollectionMap() {
  const [map, setMap] = useState(null);
  const [lng] = useState(-99.341389);
  const [lat] = useState(31.33);
  const [zoom] = useState(5.4);
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
