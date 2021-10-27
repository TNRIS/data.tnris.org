import bbox from "@turf/bbox";
import { multiPolygon, polygon } from "@turf/helpers";

export const zoomToFeatures = (map, features, padding = 100) => {
  console.log(features)
  if (map) {
    try{
      switch(features.type){
        case "MultiPolygon":
          return map.fitBounds(bbox(multiPolygon(features.coordinates)), { padding: padding})
        case "Polygon":
          return map.fitBounds(bbox(polygon(features.coordinates)), { padding: padding })
        case "FeatureCollection":
          return map.fitBounds(bbox(features), { padding: padding })
        default:
          return null
      }
    } catch (e) {
      console.log("Error when zooming to collection boundary. \n", e)
    } 
  }
};

export const zoomToBbox = (map, bboxArray, padding = 100) => {
  if(map){
    try{
      //console.log(bboxArray, polygon([bboxArray]))
      const bbox = [[bboxArray[0],bboxArray[1]], [bboxArray[2], bboxArray[3]]]
      map.fitBounds(bbox, { padding: padding})
    } catch (e) {
      console.log("Error when zooming to bbox/ \n", e)
    }
  }
}