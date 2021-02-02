import { atom, selector } from "recoil";

export const catalogPage = atom({
  key: "catalogPage",
  default: 1,
});

export const catalogIncrement = atom({
  key: "catalogIncrement",
  default: 24,
});

export const fetchCatalogCollectionsSelector = selector({
  key: "fetchCollectionsSelector",
  get: async ({ get }) => {
    const page = get(catalogPage);
    const increment = get(catalogIncrement);
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
