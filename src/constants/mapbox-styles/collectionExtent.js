export const collectionCoverageLayerStyle = {
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
};

export const collectionCoverageOutlineLayerStyle = {
  id: "collection-coverage-outline-layer",
  type: "line",
  source: "collection-coverage-source",
  minzoom: 2,
  maxzoom: 24,
  paint: {
    "line-color": "#fff",
    "line-width": 2,
  },
};

export const collectionCoverageLidarOutlineLayerStyle = {
  id: "collection-coverage-outline-layer",
  type: "line",
  source: "collection-coverage-source",
  minzoom: 2,
  maxzoom: 24,
  paint: {
    "line-color": "#ff00ff",
    "line-width": 2,
  },
};
