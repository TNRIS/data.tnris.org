import bbox from "@turf/bbox";
const countyLabelCentroids = require("../../mapdata/countyCentroids.geojson.json");

// Function for managing highlighted counties on the map.
// Used in the catalog view to (roughly) highlight collection footprint, collection view onload
export const highlightCounties = (map, counties, type, paint, filter) => {
  if (map && !map.getLayer("catalog-hover")) {
    const addFn = () =>
      map.addLayer({
        id: "catalog-hover",
        type: "fill",
        source: "area-type-source",
        "source-layer": "area_type",
        minzoom: 2,
        maxzoom: 24,
        paint: {
          "fill-color": "#1e8dc1",
          "fill-opacity": 0.25,
        },
        filter: [
          "all",
          ["==", "area_type", "county"],
          ["in", "area_type_name", ...counties.split(", ")],
        ],
      });
    if (counties && counties.length >= 1) {
      //console.log("drawing new layer")
      addFn();
      /* const features = countyLabelCentroids.features.filter((v) =>
        counties.includes(v.properties.area_type_name)
      );
      const zoomToFeatures = { ...countyLabelCentroids, features: features };
      map.fitBounds(bbox(zoomToFeatures), {
        padding: features.length < 2 ? 600 : 200,
      }); */
      //console.log(features, counties, zoomToFeatures, bbox(zoomToFeatures));
    }
  }
};
export const removeHighlightCounties = (map) => {
  if (map && map.getLayer("catalog-hover")) {
    map.removeLayer("catalog-hover");
  }
};

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
