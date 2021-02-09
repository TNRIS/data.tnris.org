import { selector } from "recoil";
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

export const fetchCatalogCollectionsSelector = selector({
  key: "fetchCollectionsSelector",
  get: async ({ get }) => {
    const page = get(catalogPageSelector);
    const increment = get(catalogIncrementSelector);
    const offset = page <= 1 ? "" : `offset=${(page - 1) * increment}&`;

    const response = await fetch(
      `https://api.tnris.org/api/v1/collections/?${offset}limit=${increment}`,
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
