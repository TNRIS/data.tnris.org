import bbox from "@turf/bbox";
import { multiPolygon, polygon } from "@turf/helpers";

export const zoomToFeatures = (map, features, padding = 100) => {
  if (map) {
    try{
      switch(features.type){
        case "MultiPolygon":
          return map.fitBounds(bbox(multiPolygon(features.coordinates)), { padding: padding})
        case "Polygon":
          return map.fitBounds(bbox(polygon(features.coordinates)), { padding: padding })
        default:
          return null
      }
    } catch (e) {
      console.log("Error when zooming to collection boundary. \n", e)
    } 
  }
};