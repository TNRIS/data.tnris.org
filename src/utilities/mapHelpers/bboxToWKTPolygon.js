import bboxPolygon from "@turf/bbox-polygon";
export const bboxToWKTPolygon = (bbox) => {
  const bbp = `POLYGON((${bboxPolygon(bbox)
    .geometry.coordinates[0].map((coords) => `${coords[0]} ${coords[1]}`)
    .toString()}))`;

  return bbp;
};
