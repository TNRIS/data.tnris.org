import { selector } from "recoil";
import { bboxToWKTPolygon } from "../utilities/mapHelpers/bboxToWKTPolygon";
import { geoSearchSelectionAtom } from "./geofilterAtoms";
import { searchString } from "./urlFactoryAtoms";
// parse pg from url, if present. If not, default to 1
export const catalogPageSelector = selector({
  key: "catalogPageSelector",
  default: 1,
  get: ({ get }) => {
    const urlParams = get(searchString);
    const pgValue = new URLSearchParams(urlParams).get("pg");

    return pgValue ? Number(pgValue) : 1;
  },
});
// parse increment from url, if present. If not, default to 24
export const catalogIncrementSelector = selector({
  key: "catalogIncrementSelector",
  default: 24,
  get: ({ get }) => {
    const urlParams = get(searchString);
    const incValue = new URLSearchParams(urlParams).get("inc");

    return incValue ? Number(incValue) : 24;
  },
});

// parse search from url
export const catalogSearchSelector = selector({
  key: "catalogSearchSelector",
  default: null,
  get: ({ get }) => {
    const urlParams = get(searchString);
    const s = new URLSearchParams(urlParams).get("s");
    if (s) {
      return `&search=${s}`;
    }
    return "";
  },
});
// parse availability from url
export const catalogAvailabilitySelector = selector({
  key: "catalogAvailabilitySelector",
  default: null,
  get: ({ get }) => {
    const urlParams = get(searchString);
    const availability = new URLSearchParams(urlParams).get("availability");
    if (availability) {
      return `&availability__icontains=${availability
        .toString()
        .replaceAll(" ", "_")}`;
    }
    return "";
  },
});
// parse category from url
export const catalogCategorySelector = selector({
  key: "catalogCategorySelector",
  default: null,
  get: ({ get }) => {
    const urlParams = get(searchString);
    const category = new URLSearchParams(urlParams).get("category");
    if (category) {
      return `&category__icontains=${category.toString().replaceAll(" ", "_")}`;
    }
    return "";
  },
});
// parse category from url
export const catalogFileTypeSelector = selector({
  key: "catalogFileTypeSelector",
  default: null,
  get: ({ get }) => {
    const urlParams = get(searchString);
    const fileType = new URLSearchParams(urlParams).get("file_type");
    if (fileType) {
      return `&file_type__icontains=${fileType
        .toString()
        .replaceAll(" ", "_")}`;
    }
    return "";
  },
});
export const catalogDateRangeSelector = selector({
  key: "catalogDateRangeSelector",
  default: null,
  get: ({ get }) => {
    const urlParams = get(searchString);
    const dr = new URLSearchParams(urlParams).get("dates");
    const drToArray = dr
      ? dr.split(",").map((v) => `01-01-${Number(v) + 1}`)
      : null;
    if (drToArray) {
      return `&acquisition_date__gte=${drToArray[0]}&acquisition_date__lte=${drToArray[1]}`;
    } else {
      return "";
    }
  },
});
export const catalogSortSelector = selector({
  key: "catalogSortSelector",
  default: null,
  get: ({ get }) => {
    const urlParams = get(searchString);
    const sort = new URLSearchParams(urlParams).get("sort");
    switch (true) {
      case sort === "NEWEST":
        return "&ordering=-acquisition_date";
      case sort === "OLDEST":
        return "&ordering=acquisition_date";
      case sort === "AZ":
        return "&ordering=name";
      case sort === "ZA":
        return "&ordering=-name";
      default:
        return "&ordering=-acquisition_date";
    }
  },
});
export const catalogBBoxSelector = selector({
  key: "catalogBBoxSelector",
  default: null,
  get: ({ get }) => {
    //const geo = get(geoFilterSelectedResult);
    const bb = get(geoSearchSelectionAtom);

    if (bb !== null) {
      // convert bbox from uri param to polygon, check if the_geom intersects new bbox polygon
      return `&the_geom__intersects=${bboxToWKTPolygon(bb["bbox"])}`;
    } else {
      return "";
    }
  },
});
export const fetchCatalogCollectionsSelector = selector({
  key: "fetchCollectionsSelector",
  get: async ({ get }) => {
    const page = get(catalogPageSelector);
    const increment = get(catalogIncrementSelector);
    const offset = page <= 1 ? "" : `offset=${(page - 1) * increment}&`;
    //get search
    const search =
      "&" + get(catalogSearchSelector).substr(1).replaceAll("&", "%26");
    //get filters
    const availability = get(catalogAvailabilitySelector);
    const category = get(catalogCategorySelector);
    const fileType = get(catalogFileTypeSelector);
    const acquisitionDateRange = get(catalogDateRangeSelector);
    const ordering = get(catalogSortSelector);
    const bbox = get(catalogBBoxSelector);
    //combine params into uri
    const uri = `${offset}limit=${increment}${search}${availability}${category}${fileType}${acquisitionDateRange}${bbox}${ordering}`;
    const response = await fetch(
      `https://api.tnris.org/api/v1/collections_catalog/?${uri}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.json();
  },
});
