export const hideLayer = (layerName, map) => {
  if (map && map.getLayer(layerName)) {
      map.setLayoutProperty(
        layerName, "visibility", "none"
      );
    }
}
export const showLayer = (layerName, map) => {
  if (map && map.getLayer(layerName)) {
      map.setLayoutProperty(
        layerName, "visibility", "visible"
      );
    }
}
