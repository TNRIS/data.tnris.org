export const highlightDownloadArea = (areaTypeId, map) => {
  if (map) {
    const addFn = () => {
      map.addLayer({
        id: "dl-hover",
        type: "line",
        source: "area-type-source",
        "source-layer": "area_type",
        minzoom: 2,
        maxzoom: 24,
        paint: {
          "line-color": "#111",
          "line-width": 4.0,
          "line-opacity": 1.0,
        },
        filter: ["all", ["==", "area_type_id", areaTypeId]],
      });
    };

    if (areaTypeId) {
      addFn();
    }
  }
};
export const removeHighlightedDownloadArea = (areaTypeId, map) => {
  if (map && map.getLayer("dl-hover")) {
    map.removeLayer("dl-hover");
  }
};


export const removeHighlightCoverage = (map) => {
  if (map && map.getLayer("collection-coverage-layer")) {
    map.removeLayer("collection-coverage-layer");
    map.removeSource("collection-coverage-source");
  }
};
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
};
