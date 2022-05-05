import { atom } from "jotai";
import { atomWithHash, } from "jotai/utils";

export const catalogPageAtom = atomWithHash("pg", 1);
export const catalogIncrementAtom = atomWithHash("inc", 24);
export const catalogSearchTextAtom = atomWithHash("s", "");
export const catalogSearchLocationAtom = atomWithHash("geo", "");
export const catalogCategoriesAtom = atomWithHash("categories", "");
export const catalogAvailabilityAtom = atomWithHash("availability", null);
export const catalogDateRangeAtom = atomWithHash("dates", "");
export const catalogSorterAtom = atomWithHash("sort", "NEW");

export const catalogFiltersAllAtom = atom((get) => {
  return {
    page: get(catalogPageAtom),
    limit: get(catalogIncrementAtom),
    search: get(catalogSearchTextAtom),
    geo: get(catalogSearchLocationAtom),
    categories: get(catalogCategoriesAtom),
    availability: get(catalogAvailabilityAtom),
    dates: get(catalogDateRangeAtom),
    ordering: get(catalogSorterAtom)
  };
});

export const fetchUrlAtom = atom(async (get) => {
  const filtersValuesAll = get(catalogFiltersAllAtom)
  const parsedFilters = {
    page: filtersValuesAll.page,
    limit: get(catalogIncrementAtom),
    search: get(catalogSearchTextAtom),
    the_geom__intersects: get(catalogSearchLocationAtom),
    categories: get(catalogCategoriesAtom),
    availability: get(catalogAvailabilityAtom),
    dates: get(catalogDateRangeAtom),
    ordering: get(catalogSorterAtom)
  }
  const filtersAsURL = new URLSearchParams()
  const response = await fetch(
    "https://api.tnris.org/api/v1/collections_catalog?limit=5"
  );
  return await response.json();
});
