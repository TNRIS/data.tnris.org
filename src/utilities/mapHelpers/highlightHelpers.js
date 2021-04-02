export const removeHighlightCoverage = (map) => {
  if (map && map.getLayer("collection-coverage-layer")) {
    map.removeLayer("collection-coverage-layer");
    map.removeSource("collection-coverage-source");
  }
}

export const highlightCoverage = (map, coverage) => {
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
        "fill-color": "#1e8dc1",
        "fill-opacity": 0.25,
      },
    });
  }
}

// Highlight a selected area type in the map
export const highlightAreaType = (areaType, areaTypeId, map) => {
  if (map) {
    if (map.getSource(`${areaType}-source`)) {
      map.setFeatureState(
        { source: `${areaType}-source`, id: areaTypeId },
        { hover: true }
      );
    }
  }
}

// Remove the highlight from a selected area type in the map
export const removeHighlightedAreaType = (areaType, areaTypeId, map) => {
  if (map) {
    if (map.getSource(`${areaType}-source`)) {
      map.setFeatureState(
        { source: `${areaType}-source`, id: areaTypeId },
        { hover: false }
      );
    }
  }
}