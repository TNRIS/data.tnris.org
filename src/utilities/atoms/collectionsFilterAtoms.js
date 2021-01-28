import { atom, selector, selectorFamily } from "recoil";

export const sort = atom({
  key: "sort",
  default: "newest",
});

export const catalogFiltersState = atom({
  key: "catalogFilters",
  default: {
    availability: [],
    category: [],
    filetype: [],
    date: [],
  },
});

const catalogFiltersSelector = selectorFamily({
  key: "catalogFiltersState",
  get: (filterType) => ({ get }) => get(catalogFiltersState)[filterType],
  set: (filterType) => ({ set }, newValue) =>
    set(catalogFiltersState, (prevState) => {
      return { ...prevState, [filterType]: newValue };
    }),
});
