import { atom, selector } from "recoil";
import { catalogIncrementSelector, catalogPageSelector } from "./catalogAtoms";

// state to url factory
export const generateCatalogSearchUriFromState = selector({
  key: "generateCatalogUriFromState",
  get: async ({ get }) => {
    const pg = get(catalogPageSelector);
    const inc = get(catalogIncrementSelector);

    const uri = `?pg=${pg}&inc=${inc}`;
    console.log(uri);
    return uri;
  },
});

// url query as state
export const searchString = atom({
  key: "searchString",
  default: null,
});


