import bbox from "@turf/bbox";
import { multiPolygon } from "@turf/helpers";

export const zoomToFeatures = (map, features, padding = 100) => {
  if (map) {
    map.fitBounds(bbox(multiPolygon(features.coordinates)), { padding: padding });
  }
};
