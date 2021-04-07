import { selector } from "recoil";
import { geoFilterSelectedResult } from "./geofilterAtoms";
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
// parse map value from url, if present. If not, default to false
export const showMapSelector = selector({
  key: "showMap",
  default: false,
  get: ({ get }) => {
    const urlParams = get(searchString);
    const showMapValue = new URLSearchParams(urlParams).get("map");

    return showMapValue ? showMapValue : false;
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
    const urlParams = get(searchString)
    const dr = new URLSearchParams(urlParams).get("dates")
    const drToArray = dr ? dr.split(",") : null
    if(drToArray){
      return `&acquisition_date__gte=${drToArray[0]}&acquisition_date__lte=${drToArray[1]}`
    }
    else {
      return ""
    }
  }
})
export const catalogSortSelector = selector({
  key: "catalogSortSelector",
  default: null,
  get: ({get}) => {
    const urlParams = get(searchString)
    const sort = new URLSearchParams(urlParams).get("sort")
    switch(true){
      case sort === "NEWEST":
        return "&ordering=-acquisition_date"
      case sort === "OLDEST":
        return "&ordering=acquisition_date"
      case sort === "AZ":
        return "&ordering=name"
      case sort === "ZA":
        return "&ordering=-name"
      default:
        return "&ordering=-acquisition_date"
    }
  }
})
export const catalogBBoxSelector = selector({
  key: "catalogBBoxSelector",
  default: null,
  get: ({ get }) => {
    const geo = get(geoFilterSelectedResult);
    
    if (geo !== null) {
      return `&in_bbox=${geo.bbox.toString()}`
    } else {
      return ""
    }
  }
})
export const fetchCatalogCollectionsSelector = selector({
  key: "fetchCollectionsSelector",
  get: async ({ get }) => {
    const page = get(catalogPageSelector);
    const increment = get(catalogIncrementSelector);
    const offset = page <= 1 ? "" : `offset=${(page - 1) * increment}&`;
    //get search
    const search = get(catalogSearchSelector);
    //get filters
    const availability = get(catalogAvailabilitySelector);
    const category = get(catalogCategorySelector);
    const fileType = get(catalogFileTypeSelector);
    const acquisitionDateRange = get(catalogDateRangeSelector);
    const ordering = get(catalogSortSelector);
    const bbox = get(catalogBBoxSelector);
    const response = await fetch(
      `http://localhost:8000/api/v1/collections_catalog/?${offset}limit=${increment}${search}${availability}${category}${fileType}${acquisitionDateRange}${bbox}${ordering}`,
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
