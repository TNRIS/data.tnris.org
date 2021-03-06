export const removeCoverageLayer = (map) => {
  if (map && map.getLayer("collection-coverage-layer")) {
    map.removeLayer("collection-coverage-layer");
    map.removeLayer("collection-coverage-outline-layer");
    map.removeSource("collection-coverage-source");
  }
};

export const addCoverageLayer = (map, coverage) => {
  if (map && map.getSource("collection-coverage-source")) {
    map.removeLayer("collection-coverage-layer");
    map.removeSource("collection-coverage-source");
  }
  if (map) {
    map.addSource("collection-coverage-source", {
      type: "geojson",
      data: coverage,
    });
    map.addLayer({
      id: "collection-coverage-layer",
      type: "fill",
      source: "collection-coverage-source",
      minzoom: 2,
      maxzoom: 24,
      paint: {
        "fill-color": "#73808c",
        "fill-opacity": 0.25,
        "fill-outline-color": "#73808C",
      },
    });
    map.addLayer({
      id: "collection-coverage-outline-layer",
      type: "line",
      source: "collection-coverage-source",
      minzoom: 2,
      maxzoom: 24,
      paint: {
        "line-color": "#fff",
        "line-width": 2,
      },
    });
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
