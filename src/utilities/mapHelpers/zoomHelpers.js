import bbox from "@turf/bbox";

const zoomToFeatures = (features, map, padding=100) => {
    map.fitBounds(bbox(features), { padding: padding })
}