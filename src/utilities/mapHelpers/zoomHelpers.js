import bbox from "@turf/bbox";
import { multiPolygon } from "@turf/helpers";

export const zoomToFeatures = (map, features, padding = 100) => {
  if (map) {
    console.log(bbox(multiPolygon(features)));
    if (features.coordinates.length > 4) {
      map.fitBounds(bbox(multiPolygon(features.coordinates)), {
        padding: padding,
      });
    }
  }
};
