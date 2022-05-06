import bboxPolygon from "@turf/bbox-polygon";
import { collectionCoverageLayerStyle, collectionCoverageOutlineLayerStyle } from "../../constants/mapbox-styles/collectionExtent";
import { geosearchLayer } from "../../constants/mapbox-styles/geosearch";

export const removeCoverageLayer = (map) => {
  if (map && map.getLayer("collection-coverage-layer")) {
    map.removeLayer("collection-coverage-outline-layer");
    map.removeLayer("collection-coverage-layer");
    map.removeSource("collection-coverage-source");
  }
};
export const addCoverageLayer = (
  map, 
  coverage, 
  outlineStyle = collectionCoverageOutlineLayerStyle, 
  fillStyle = collectionCoverageLayerStyle
  ) => {
  if (map && map.getSource("collection-coverage-source")) {
    map.removeLayer("collection-coverage-outline-layer");
    map.removeLayer("collection-coverage-layer");
    map.removeSource("collection-coverage-source");
  }
  if (map) {
    map.addSource("collection-coverage-source", {
      type: "geojson",
      data: coverage,
    });
    map.addLayer(fillStyle);
    map.addLayer(outlineStyle);
  }
};
// Highlight a selected area type in the map
export const highlightSelectedAreaType = (areaType, areaTypeId, map) => {
  if (map) {
    if (map.getSource(`${areaType}-source`)) {
      map.setFeatureState(
        { source: `${areaType}-source`, id: areaTypeId },
        { hover: true }
      );
    }
  }
};
// Remove the highlight from a selected area type in the map
export const unHighlightSelectedAreaType = (areaType, areaTypeId, map) => {
  if (map) {
    if (map.getSource(`${areaType}-source`)) {
      map.setFeatureState(
        { source: `${areaType}-source`, id: areaTypeId },
        { hover: false }
      );
    }
  }
};
export const addGeoSearchBboxToMap = (map, bboxArray) => {
  if (map) {
    map.addSource("geosearch-source", {
      type: "geojson",
      data: bboxPolygon(bboxArray),
    });
    map.addLayer(geosearchLayer);
  }
};
export const removeGeoSearchBboxFromMap = (map) => {
  if (map) {
    try {
      if (
        map.getSource("geosearch-source") &&
        map.getLayer("geosearch-layer")
      ) {
        map.removeLayer("geosearch-layer");
        map.removeSource("geosearch-source");
      }
    } catch (e) {
      console.log(
        "Error while attempting to remove geosearch bbox from map \n",
        e
      );
    }
  }
};
