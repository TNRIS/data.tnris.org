export const hideLayer = (layerBaseName, map) => {
  if (map.getLayer(`${layerBaseName}-outline`)) {
      map.setLayoutProperty(
        `${layerBaseName}-outline`, "visibility", "none"
      );
      map.setLayoutProperty(
        `${layerBaseName}-hover`, "visibility", "none"
      );
    }
}

export const showLayer = (layerBaseName, map) => {
  if (map.getLayer(`${layerBaseName}-outline`)) {
      map.setLayoutProperty(
        `${layerBaseName}-outline`, "visibility", "visible"
      );
      map.setLayoutProperty(
        `${layerBaseName}-hover`, "visibility", "visible"
      );
    }
}